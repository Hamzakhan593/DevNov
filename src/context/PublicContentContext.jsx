import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import managedProjects from '../data/projects.json';
import {
  projects as legacyProjects,
  services as legacyServices,
  technologies as legacyTechnologies,
} from '../data/agencyData.js';
import {
  fetchPublicContent,
  normalizeProjects,
  normalizeServices,
  normalizeTechnologies,
} from '../lib/contentRepository.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

const projectKey = (project) => String(project.slug || project.id || '');

function sortContent(items) {
  return [...items].sort((left, right) => {
    const leftOrder = Number.isFinite(left.sortOrder) ? left.sortOrder : Number.MAX_SAFE_INTEGER;
    const rightOrder = Number.isFinite(right.sortOrder) ? right.sortOrder : Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder;
  });
}

function fallbackProjects() {
  const seen = new Set();
  return sortContent(normalizeProjects([...managedProjects, ...legacyProjects]).filter((project) => {
    const key = projectKey(project);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }));
}

function createFallbackContent() {
  return {
    projects: fallbackProjects(),
    services: sortContent(normalizeServices(legacyServices)),
    technologies: sortContent(normalizeTechnologies(legacyTechnologies)),
  };
}

const staticContent = createFallbackContent();
// Once Supabase is configured, the backend is the source of truth for the
// public portfolio. In particular, an unavailable backend must not make old
// static examples look like client work while it recovers.
const configuredFallbackContent = {
  projects: [],
  services: staticContent.services,
  technologies: staticContent.technologies,
};

const staticValue = {
  ...staticContent,
  loading: false,
  error: null,
  source: 'static',
  projectsState: 'static',
  refresh: async () => staticContent,
};

const PublicContentContext = createContext(null);

function messageFor(errors) {
  const failedResources = Object.entries(errors || {})
    .filter(([key, value]) => key !== 'projectTechnologies' && key !== 'configuration' && value)
    .map(([key]) => key);
  if (!failedResources.length) return null;
  const projectFailure = failedResources.includes('projects');
  const remaining = failedResources.filter((resource) => resource !== 'projects');
  if (projectFailure && remaining.length) return `Could not load the published portfolio or ${remaining.join(', ')} from the content backend. The portfolio stays hidden until its connection is restored.`;
  if (projectFailure) return 'Could not load the published portfolio from the content backend. The portfolio stays hidden until its connection is restored.';
  return `Could not load ${remaining.join(', ')} from the content backend. Available content is still shown.`;
}

/**
 * Provides live, published Supabase content to public-facing sections.
 * Static content remains useful for an unconfigured local preview. Once a
 * backend is configured, published projects never fall back to examples: an
 * empty or unavailable portfolio is intentionally represented as empty.
 */
export function PublicContentProvider({ children }) {
  const [content, setContent] = useState(isSupabaseConfigured ? configuredFallbackContent : staticContent);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(isSupabaseConfigured ? 'backend-loading' : 'static');
  const [projectsState, setProjectsState] = useState(isSupabaseConfigured ? 'loading' : 'static');

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setContent(staticContent);
      setLoading(false);
      setError(null);
      setSource('static');
      setProjectsState('static');
      return staticContent;
    }

    setLoading(true);
    try {
      const result = await fetchPublicContent();
      const projectsAvailable = Array.isArray(result.projects);
      const projectState = !projectsAvailable
        ? 'unavailable'
        : result.projects.length
          ? 'ready'
          : 'empty';
      const nextContent = {
        projects: projectsAvailable ? sortContent(result.projects) : [],
        services: result.services === null ? staticContent.services : sortContent(result.services),
        technologies: result.technologies === null ? staticContent.technologies : sortContent(result.technologies),
      };

      setContent(nextContent);
      setError(messageFor(result.errors));
      setProjectsState(projectState);
      setSource(projectState === 'unavailable'
        ? 'backend-unavailable'
        : result.services === null || result.technologies === null
          ? 'mixed'
          : 'backend');
      return nextContent;
    } catch {
      setContent(configuredFallbackContent);
      setError('Could not load the content backend. The published portfolio stays hidden until its connection is restored.');
      setProjectsState('unavailable');
      setSource('backend-unavailable');
      return configuredFallbackContent;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void refresh().then((nextContent) => {
      if (!active) return;
      return nextContent;
    });
    return () => { active = false; };
  }, [refresh]);

  const value = useMemo(() => ({ ...content, loading, error, source, projectsState, refresh }), [content, error, loading, projectsState, refresh, source]);
  return <PublicContentContext.Provider value={value}>{children}</PublicContentContext.Provider>;
}

/** Components remain safe in previews/tests that have not mounted the provider. */
export function usePublicContent() {
  return useContext(PublicContentContext) || staticValue;
}

export default PublicContentProvider;
