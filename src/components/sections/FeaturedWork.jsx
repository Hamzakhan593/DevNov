import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, FolderOpen, Globe2, ImageIcon, Layers3 } from 'lucide-react';
import { usePublicContent } from '../../context/PublicContentContext.jsx';
import ProjectCard from '../ui/ProjectCard.jsx';
import CaseStudyDialog from '../ui/CaseStudyDialog.jsx';
import './featured-work.css';

const isPublished = (project) => project && project.published !== false && project.title && project.summary;
const slugOf = (project) => String(project.slug || project.id || '');
const compareProjects = (left, right) => {
  const featuredDifference = Number(Boolean(right.featured)) - Number(Boolean(left.featured));
  if (featuredDifference) return featuredDifference;
  const leftOrder = Number.isFinite(left.sortOrder) ? left.sortOrder : Number.MAX_SAFE_INTEGER;
  const rightOrder = Number.isFinite(right.sortOrder) ? right.sortOrder : Number.MAX_SAFE_INTEGER;
  return leftOrder - rightOrder;
};
const categoryLabels = {
  'e-commerce platform': 'E-commerce',
  'education management platform': 'Education management',
  'business operations platform': 'Business operations',
  'food ordering platform': 'Food ordering',
};

const publicationStandards = [
  {
    icon: Globe2,
    title: 'A live home',
    description: 'Where it is appropriate to share, each project will link to its hosted experience.',
  },
  {
    icon: ImageIcon,
    title: 'Approved context',
    description: 'Screens and details will explain the work without exposing client-sensitive information.',
  },
  {
    icon: Layers3,
    title: 'The useful story',
    description: 'Every case study will focus on the product, the problem and the work that went into it.',
  },
];

function ProjectFilters({ categories, activeCategory, onChange }) {
  return (
    <div className="dn-work-filter-shell">
      <div className="dn-work-filters" role="group" aria-label="Filter projects by category">
        {categories.map((category) => <button key={category} type="button" aria-label={category} title={category} aria-pressed={activeCategory === category} onClick={() => onChange(category)} className="dn-work-filter">{categoryLabels[category.toLowerCase()] || category}</button>)}
      </div>
    </div>
  );
}

function WorkLoadingState() {
  return (
    <div className="grid gap-4 md:grid-cols-3" aria-busy="true" aria-label="Loading published projects">
      {[0, 1, 2].map((item) => (
        <div key={item} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.055]" aria-hidden="true">
          <div className="aspect-[16/10] animate-pulse bg-white/[.09]" />
          <div className="space-y-3 p-5"><div className="h-3 w-20 rounded-full bg-white/[.1]" /><div className="h-5 w-3/4 rounded-full bg-white/[.12]" /><div className="h-3 w-full rounded-full bg-white/[.08]" /><div className="h-3 w-5/6 rounded-full bg-white/[.08]" /></div>
        </div>
      ))}
    </div>
  );
}

function EmptyPortfolioState({ unavailable = false }) {
  const title = unavailable ? 'The portfolio is temporarily offline.' : 'Real work, shown with the context it deserves.';
  const description = unavailable
    ? 'We are reconnecting our published case studies. Contact us to discuss work relevant to your project.'
    : 'Our first public case studies are being prepared, with approved visuals and the context behind each project.';
  return (
    <div className="dn-work-empty grid overflow-hidden rounded-[22px] border border-white/10 bg-[#132536]/90 shadow-[0_18px_40px_rgba(0,0,0,.18)] lg:grid-cols-[minmax(0,1.07fr)_minmax(360px,.93fr)]">
      <div className="dn-work-empty-copy relative overflow-hidden sm:p-9 lg:p-10">
        <div className="absolute -left-20 top-6 size-48 rounded-full bg-[#ff5d2a]/15 blur-3xl" aria-hidden="true" />
        <div className="relative"><span className="inline-flex items-center gap-2 rounded-full border border-[#ff8d69]/30 bg-[#ff6130]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.08em] text-[#ffb49b]"><FolderOpen className="size-3.5 shrink-0" aria-hidden="true" /> {unavailable ? 'Portfolio connection' : 'Portfolio update'}</span><h3 className="dn-work-empty-title">{title}</h3><p className="mt-4 max-w-[540px] text-sm leading-7 text-[#bdcad4]">{description}</p><a href="#contact" className="dev-primary mt-6">Discuss your project <ArrowRight className="size-4 shrink-0" aria-hidden="true" /></a></div>
      </div>
      <ol className="grid border-t border-white/10 bg-white/[.035] sm:grid-cols-3 lg:grid-cols-1 lg:border-l lg:border-t-0">
        {publicationStandards.map(({ icon: Icon, title, description }, index) => <li key={title} className={`p-6 ${index > 0 ? 'border-t border-white/10 sm:border-l sm:border-t-0 lg:border-l-0 lg:border-t' : ''}`}><span className="grid size-9 place-items-center rounded-xl border border-[#ff9b78]/20 bg-[#ff6331]/10 text-[#ffad91]"><Icon className="size-[18px]" /></span><h4 className="mt-4 text-sm font-bold text-white">{title}</h4><p className="mt-2 text-xs leading-5 text-[#aebfcd]">{description}</p></li>)}
      </ol>
    </div>
  );
}

export default function FeaturedWork() {
  const { projects: publicProjects, loading, projectsState } = usePublicContent();
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const publishedProjects = useMemo(() => (Array.isArray(publicProjects) ? publicProjects : [])
    .filter(isPublished)
    .filter((project, index, entries) => entries.findIndex((other) => slugOf(other) === slugOf(project)) === index)
    .sort(compareProjects), [publicProjects]);
  const categories = useMemo(() => ['All', ...new Set(publishedProjects.map((item) => item.category || 'Software'))], [publishedProjects]);
  const filtered = useMemo(() => activeCategory === 'All' ? publishedProjects : publishedProjects.filter((item) => (item.category || 'Software') === activeCategory), [activeCategory, publishedProjects]);
  const visible = showAll ? filtered : filtered.slice(0, 6);
  const hasProjects = publishedProjects.length > 0;
  const isLoading = !hasProjects && (projectsState === 'loading' || (!projectsState && loading));
  const portfolioUnavailable = !hasProjects && projectsState === 'unavailable';
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (activeCategory !== 'All' && !categories.includes(activeCategory)) setActiveCategory('All');
  }, [activeCategory, categories]);

  useEffect(() => {
    const syncWithLocation = () => {
      const slug = new URLSearchParams(window.location.search).get('project');
      setSelectedProject(slug ? publishedProjects.find((entry) => slugOf(entry) === slug) || null : null);
    };
    syncWithLocation();
    window.addEventListener('popstate', syncWithLocation);
    return () => window.removeEventListener('popstate', syncWithLocation);
  }, [publishedProjects]);
  const openProject = (project) => {
    const url = new URL(window.location.href);
    url.searchParams.set('project', slugOf(project));
    url.hash = 'work';
    window.history.pushState({ devnovCaseStudy: slugOf(project) }, '', url);
    setSelectedProject(project);
  };
  const closeProject = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('project');
    window.history.replaceState(window.history.state, '', url);
    setSelectedProject(null);
  };
  return (
    <section id="work" className="dn-work-section bg-[#f7f9fc] py-8 sm:py-12" aria-labelledby="work-heading">
      <div className="dev-container"><div className="dev-featured dn-work-panel">
        <div className="dn-work-intro">
          <div className="dn-work-copy"><p className="eyebrow !text-[#ff9a78]">Selected work</p><h2 id="work-heading" className="dn-work-heading">{hasProjects ? 'Software built around real business goals.' : portfolioUnavailable ? 'The portfolio will be back shortly.' : 'The portfolio is being built the right way.'}</h2><p className="dn-work-description">{hasProjects ? 'Explore our work, from the product challenge to the technology and live experience.' : portfolioUnavailable ? 'Our published case studies are temporarily unavailable. Please check back soon or contact us to discuss relevant work.' : 'We are preparing our first public case studies, with hosted projects, clear visuals and the story behind the work.'}</p></div>
          <div className="dn-work-ctas"><a href="#contact" className="dev-primary">Start a project <ArrowRight className="size-4" aria-hidden="true" /></a><a href="#services" className="dn-work-secondary">Our services <ArrowUpRight className="size-4" aria-hidden="true" /></a></div>
        </div>

        <div className="dn-work-listing">
          {isLoading ? <WorkLoadingState /> : hasProjects ? <>
            <ProjectFilters categories={categories} activeCategory={activeCategory} onChange={(category) => { setActiveCategory(category); setShowAll(false); }} />
            <p className="dn-work-count" role="status">{filtered.length} {filtered.length === 1 ? 'published case study' : 'published case studies'}</p>
            <div className="dn-work-grid">{visible.map((project, index) => <motion.div key={slugOf(project)} initial={reducedMotion ? false : { opacity: 0, y: 13 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: reducedMotion ? 0 : .32, delay: reducedMotion ? 0 : Math.min(index, 5) * .05 }}><ProjectCard project={project} onDetails={() => openProject(project)} /></motion.div>)}</div>
            {filtered.length > 6 && <button type="button" onClick={() => setShowAll((shown) => !shown)} className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#ff9b75] transition hover:text-white hover:underline">{showAll ? 'Show fewer projects' : `View all ${filtered.length} projects`} <ArrowRight className="size-4" /></button>}
          </> : <EmptyPortfolioState unavailable={portfolioUnavailable} />}
        </div>
      </div></div>
      <AnimatePresence>{selectedProject && <CaseStudyDialog key={slugOf(selectedProject)} project={selectedProject} onClose={closeProject} />}</AnimatePresence>
    </section>
  );
}
