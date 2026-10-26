import { isSupabaseConfigured, projectMediaBucket, supabase } from './supabase.js';

const projectImageExtensions = '(?:png|jpe?g|webp|avif|gif)';
const localProjectImagePattern = new RegExp(
  `^/projects/(?:[a-zA-Z0-9_-]+/)*[a-zA-Z0-9_-][a-zA-Z0-9._-]*\\.${projectImageExtensions}$`,
  'i',
);

const isRecord = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const text = (value) => typeof value === 'string' ? value.trim() : '';

const firstText = (record, fields) => {
  if (!isRecord(record)) return '';
  for (const field of fields) {
    const value = text(record[field]);
    if (value) return value;
  }
  return '';
};

const slugify = (value) => text(value)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const toSortOrder = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const isTruthy = (value) => value === true || value === 1 || String(value).toLowerCase() === 'true';
const isExplicitlyUnpublished = (value) => value === false || value === 0 || String(value).toLowerCase() === 'false';

/** Only HTTPS URLs are allowed for public backend-hosted images and links. */
export function isSafeHttpsUrl(value) {
  if (!text(value)) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function stringList(value) {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => {
      if (typeof entry === 'string') return text(entry) ? [text(entry)] : [];
      if (!isRecord(entry)) return [];
      const label = firstText(entry, ['label', 'name', 'title', 'slug', 'id']);
      return label ? [label] : [];
    });
  }

  if (typeof value !== 'string') return [];
  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return stringList(parsed);
  } catch {
    // A normal comma-separated text value is also supported for migration work.
  }

  return trimmed.split(',').map((entry) => entry.trim()).filter(Boolean);
}

function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean))];
}

function storagePath(value, bucket) {
  const raw = text(value).replace(/^\/+/, '');
  if (!raw) return '';
  const bucketPrefix = `${bucket}/`;
  return raw.startsWith(bucketPrefix) ? raw.slice(bucketPrefix.length) : raw;
}

/**
 * Resolves direct image URLs and the legacy local asset paths synchronously.
 * Private Supabase storage paths are resolved asynchronously below.
 */
export function resolveProjectImage(record) {
  const directUrl = firstText(record, ['image_url', 'imageUrl', 'screenshot_url', 'screenshotUrl']);
  if (isSafeHttpsUrl(directUrl)) return directUrl;

  const imageValue = firstText(record, ['image', 'image_path', 'imagePath', 'storage_path', 'storagePath']);
  if (isSafeHttpsUrl(imageValue) || localProjectImagePattern.test(imageValue)) return imageValue;
  return '';
}

/**
 * Gives published project images a short-lived HTTPS URL without making the
 * `project-media` bucket public. The storage policy still decides whether this
 * browser may create a signed URL for a given image path.
 */
export async function resolveProjectImageUrl(record) {
  const resolvedImage = resolveProjectImage(record);
  if (resolvedImage) return resolvedImage;

  const imageValue = firstText(record, ['image', 'image_path', 'imagePath', 'storage_path', 'storagePath']);
  if (!imageValue || !isSupabaseConfigured || !supabase) return '';

  const bucket = firstText(record, ['image_bucket', 'imageBucket', 'storage_bucket', 'storageBucket']) || projectMediaBucket;
  const path = storagePath(imageValue, bucket);
  if (!path) return '';

  try {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60);
    return !error && isSafeHttpsUrl(data?.signedUrl) ? data.signedUrl : '';
  } catch {
    return '';
  }
}

function fallbackId(record, prefix) {
  return firstText(record, ['id', 'slug']) || slugify(firstText(record, ['title', 'label', 'name'])) || `${prefix}-item`;
}

export function normalizeTechnology(record) {
  const label = firstText(record, ['label', 'name', 'title']);
  const id = fallbackId(record, 'technology');
  const slug = firstText(record, ['slug']) || slugify(label) || id;
  const group = firstText(record, ['group']).toLowerCase();

  return {
    id,
    slug,
    label: label || slug,
    category: firstText(record, ['category']) || 'Technology',
    group: group === 'ai' ? 'ai' : group === 'core' ? 'core' : '',
    iconKey: firstText(record, ['icon_key', 'iconKey']) || slug,
    published: !isExplicitlyUnpublished(record?.published),
    sortOrder: toSortOrder(record?.sort_order ?? record?.sortOrder),
  };
}

export function normalizeService(record) {
  const title = firstText(record, ['title', 'name']);
  const id = fallbackId(record, 'service');
  const slug = firstText(record, ['slug']) || slugify(title) || id;

  return {
    id,
    slug,
    title: title || slug,
    description: firstText(record, ['description', 'summary']),
    capabilities: uniqueStrings(stringList(record?.capabilities ?? record?.features)),
    iconKey: firstText(record, ['icon_key', 'iconKey']) || slug,
    published: !isExplicitlyUnpublished(record?.published),
    sortOrder: toSortOrder(record?.sort_order ?? record?.sortOrder),
  };
}

export function normalizeProject(record, options = {}) {
  const title = firstText(record, ['title', 'name']);
  const id = fallbackId(record, 'project');
  const slug = firstText(record, ['slug']) || slugify(title) || id;
  const suppliedTechnologies = Array.isArray(options.technologies) ? options.technologies : [];
  const inlineTechnologies = stringList(record?.technologies ?? record?.tech_stack ?? record?.techStack);

  return {
    id,
    slug,
    title: title || slug,
    summary: firstText(record, ['summary', 'description', 'short_description', 'shortDescription']),
    category: firstText(record, ['category', 'project_type', 'projectType']) || 'Software',
    technologies: uniqueStrings(suppliedTechnologies.length ? suppliedTechnologies : inlineTechnologies),
    image: resolveProjectImage(record),
    imageAlt: firstText(record, ['image_alt', 'imageAlt', 'screenshot_alt', 'screenshotAlt']),
    liveUrl: firstText(record, ['live_url', 'liveUrl', 'website_url', 'websiteUrl']),
    repositoryUrl: firstText(record, ['repository_url', 'repositoryUrl', 'github_url', 'githubUrl']),
    challenge: firstText(record, ['challenge']),
    solution: firstText(record, ['solution', 'approach']),
    outcome: firstText(record, ['outcome', 'result']),
    featured: isTruthy(record?.featured),
    published: !isExplicitlyUnpublished(record?.published),
    sortOrder: toSortOrder(record?.sort_order ?? record?.sortOrder),
    demo: isTruthy(record?.demo),
  };
}

export function normalizeTechnologies(records) {
  return (Array.isArray(records) ? records : []).map(normalizeTechnology).filter((item) => item.label && item.published);
}

export function normalizeServices(records) {
  return (Array.isArray(records) ? records : []).map(normalizeService).filter((item) => item.title && item.published);
}

function relationshipsByProject(records, technologies) {
  const labelById = new Map(technologies.map((technology) => [String(technology.id), technology.label]));
  const result = new Map();

  for (const relationship of Array.isArray(records) ? records : []) {
    const projectId = text(relationship?.project_id ?? relationship?.projectId);
    const technologyId = text(relationship?.technology_id ?? relationship?.technologyId);
    const embeddedTechnology = relationship?.technologies ?? relationship?.technology;
    const label = labelById.get(technologyId)
      || firstText(embeddedTechnology, ['label', 'name', 'title', 'slug'])
      || technologyId;
    if (!projectId || !label) continue;
    result.set(projectId, uniqueStrings([...(result.get(projectId) || []), label]));
  }

  return result;
}

export function normalizeProjects(records, technologies = [], relationships = []) {
  const technologyLabels = relationshipsByProject(relationships, technologies);
  return (Array.isArray(records) ? records : [])
    .map((record) => normalizeProject(record, { technologies: technologyLabels.get(String(record?.id)) || [] }))
    // A legacy `demo` marker is never portfolio proof, even in an
    // unconfigured/local fallback. Supabase project rows do not use it.
    .filter((item) => item.title && item.summary && item.published && !item.demo);
}

async function normalizeProjectsWithSignedImages(records, technologies, relationships) {
  const technologyLabels = relationshipsByProject(relationships, technologies);
  const projects = await Promise.all((Array.isArray(records) ? records : []).map(async (record) => {
    const project = normalizeProject(record, { technologies: technologyLabels.get(String(record?.id)) || [] });
    if (!project.title || !project.summary || !project.published || project.demo) return null;
    const signedImage = await resolveProjectImageUrl(record);
    return signedImage ? { ...project, image: signedImage } : project;
  }));
  return projects.filter(Boolean);
}

async function getPublishedRows(table) {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true });
    return { data: error ? null : (Array.isArray(data) ? data : []), error: error || null };
  } catch (error) {
    return { data: null, error };
  }
}

async function getProjectTechnologyRows() {
  try {
    const { data, error } = await supabase
      .from('project_technologies')
      .select('project_id, technology_id, sort_order')
      .order('sort_order', { ascending: true });
    return { data: error ? [] : (Array.isArray(data) ? data : []), error: error || null };
  } catch (error) {
    return { data: [], error };
  }
}

/**
 * Loads all public portfolio content. A failed resource is returned as `null`
 * so the context can fall back only for that resource, while successful empty
 * tables remain intentionally empty.
 */
export async function fetchPublicContent() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      projects: null,
      services: null,
      technologies: null,
      errors: { configuration: new Error('Supabase is not configured.') },
    };
  }

  const [projectResult, serviceResult, technologyResult, relationshipResult] = await Promise.all([
    getPublishedRows('projects'),
    getPublishedRows('services'),
    getPublishedRows('technologies'),
    getProjectTechnologyRows(),
  ]);

  const technologies = technologyResult.data === null ? null : normalizeTechnologies(technologyResult.data);
  const projects = projectResult.data === null
    ? null
    : await normalizeProjectsWithSignedImages(projectResult.data, technologies || [], relationshipResult.data);
  const services = serviceResult.data === null ? null : normalizeServices(serviceResult.data);

  return {
    projects,
    services,
    technologies,
    errors: {
      projects: projectResult.error,
      services: serviceResult.error,
      technologies: technologyResult.error,
      projectTechnologies: relationshipResult.error,
    },
  };
}
