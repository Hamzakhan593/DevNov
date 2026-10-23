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
const staticValue = {
  ...staticContent,
  loading: false,
  error: null,
  source: 'static',
  refresh: async () => staticContent,
};

const PublicContentContext = createContext(null);

function messageFor(errors) {
  const failedResources = Object.entries(errors || {})
    .filter(([key, value]) => key !== 'projectTechnologies' && key !== 'configuration' && value)
    .map(([key]) => key);
  if (!failedResources.length) return null;
  return `Could not load ${failedResources.join(', ')} from the content backend. Static content is shown instead.`;
}

/**
 * Provides live, published Supabase content to public-facing sections.
 * Each resource falls back independently, so a temporary backend issue never
 * blanks the portfolio, services, or technology stack.
 */
export function PublicContentProvider({ children }) {
  const [content, setContent] = useState(staticContent);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('static');

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setContent(staticContent);
      setLoading(false);
      setError(null);
      setSource('static');
      return staticContent;
    }

    setLoading(true);
    try {
      const result = await fetchPublicContent();
      const nextContent = {
        projects: result.projects === null ? staticContent.projects : sortContent(result.projects),
        services: result.services === null ? staticContent.services : sortContent(result.services),
        technologies: result.technologies === null ? staticContent.technologies : sortContent(result.technologies),
      };

      setContent(nextContent);
      setError(messageFor(result.errors));
      setSource(result.projects === null || result.services === null || result.technologies === null ? 'mixed' : 'backend');
      return nextContent;
    } catch {
      setContent(staticContent);
      setError('Could not load the content backend. Static content is shown instead.');
      setSource('static');
      return staticContent;
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

  const value = useMemo(() => ({ ...content, loading, error, source, refresh }), [content, error, loading, refresh, source]);
  return <PublicContentContext.Provider value={value}>{children}</PublicContentContext.Provider>;
}

/** Components remain safe in previews/tests that have not mounted the provider. */
export function usePublicContent() {
  return useContext(PublicContentContext) || staticValue;
}

export default PublicContentProvider;
