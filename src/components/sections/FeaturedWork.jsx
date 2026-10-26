import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, FolderOpen, Globe2, ImageIcon, Layers3 } from 'lucide-react';
import { usePublicContent } from '../../context/PublicContentContext.jsx';
import ProjectCard from '../ui/ProjectCard.jsx';
import CaseStudyDialog from '../ui/CaseStudyDialog.jsx';

const isPublished = (project) => project && project.published !== false && project.title && project.summary;
const slugOf = (project) => String(project.slug || project.id || '');
const compareProjects = (left, right) => {
  const featuredDifference = Number(Boolean(right.featured)) - Number(Boolean(left.featured));
  if (featuredDifference) return featuredDifference;
  const leftOrder = Number.isFinite(left.sortOrder) ? left.sortOrder : Number.MAX_SAFE_INTEGER;
  const rightOrder = Number.isFinite(right.sortOrder) ? right.sortOrder : Number.MAX_SAFE_INTEGER;
  return leftOrder - rightOrder;
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
    ? 'We are reconnecting the published case studies. We do not replace real work with invented client examples while that happens.'
    : 'Our first public case studies are being prepared. We only publish work when the hosted project, visuals and client-safe story are ready to stand behind.';
  return (
    <div className="grid overflow-hidden rounded-[22px] border border-white/10 bg-[#132536]/90 shadow-[0_18px_40px_rgba(0,0,0,.18)] lg:grid-cols-[minmax(0,1.07fr)_minmax(360px,.93fr)]">
      <div className="relative overflow-hidden p-7 sm:p-9 lg:p-10">
        <div className="absolute -left-20 top-6 size-48 rounded-full bg-[#ff5d2a]/15 blur-3xl" aria-hidden="true" />
        <div className="relative"><span className="inline-flex items-center gap-2 rounded-full border border-[#ff8d69]/30 bg-[#ff6130]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.08em] text-[#ffb49b]"><FolderOpen className="size-3.5" /> {unavailable ? 'Portfolio connection' : 'Portfolio update'}</span><h3 className="mt-5 max-w-[510px] text-[clamp(1.7rem,3vw,2.4rem)] font-extrabold leading-[1.1] tracking-[-.055em] text-white">{title}</h3><p className="mt-4 max-w-[540px] text-sm leading-7 text-[#bdcad4]">{description}</p><a href="#contact" className="dev-primary mt-7">Discuss your project <ArrowRight className="size-4" /></a></div>
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
    <section id="work" className="scroll-mt-24 bg-[#f7f9fc] py-8 sm:py-12" aria-labelledby="work-heading">
      <div className="dev-container"><div className="dev-featured px-6 py-9 sm:px-9 sm:py-11 lg:px-11 lg:py-12">
        <div className="flex flex-col gap-7 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="max-w-[720px]"><p className="eyebrow !text-[#ff9a78]">Selected work</p><h2 id="work-heading" className="mt-3 text-[clamp(2.15rem,4vw,3.65rem)] font-extrabold leading-[1.04] tracking-[-.065em] text-white">{hasProjects ? <>Software built around<br className="hidden sm:block" /> real business goals.</> : portfolioUnavailable ? <>The portfolio will be<br className="hidden sm:block" /> back shortly.</> : <>The portfolio is being<br className="hidden sm:block" /> built the right way.</>}</h2><p className="mt-5 max-w-[650px] text-sm leading-7 text-[#b8c6d2]">{hasProjects ? 'Explore the DevNov projects that are ready to share, with their product context, technology and live links where available.' : portfolioUnavailable ? 'We are restoring the connection to our published case studies. We will not replace them with made-up client work while it reconnects.' : 'Instead of filling this space with made-up client work, we are preparing a portfolio of genuine, hosted projects that visitors can explore with confidence.'}</p></div>
          <div className="flex shrink-0 flex-wrap gap-3"><a href="#contact" className="dev-primary">Start a project <ArrowRight className="size-4" /></a><a href="#services" className="inline-flex min-h-[47px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[.06] px-4 text-sm font-bold text-white transition hover:border-[#ff906d] hover:bg-white/[.1]">Our services <ArrowUpRight className="size-4" /></a></div>
        </div>

        <div className="mt-7">
          {isLoading ? <WorkLoadingState /> : hasProjects ? <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-2" aria-label="Filter projects by category">{categories.map((category) => <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => { setActiveCategory(category); setShowAll(false); }} className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${activeCategory === category ? 'border-[#ff4b16] bg-[#ff4b16] text-white shadow-[0_6px_14px_rgba(255,75,22,.22)]' : 'border-[#506173] bg-[#243546] text-[#d5e0e8] hover:border-[#ff946e] hover:text-white'}`}>{category}</button>)}</div><p className="text-xs font-semibold text-[#aebfcd]">{filtered.length} {filtered.length === 1 ? 'published case study' : 'published case studies'}</p></div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map((project, index) => <motion.div key={slugOf(project)} initial={reducedMotion ? false : { opacity: 0, y: 13 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: .32, delay: reducedMotion ? 0 : Math.min(index, 5) * .05 }}><ProjectCard project={project} onDetails={() => openProject(project)} /></motion.div>)}</div>
            {filtered.length > 6 && <button type="button" onClick={() => setShowAll((shown) => !shown)} className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#ff9b75] transition hover:text-white hover:underline">{showAll ? 'Show fewer projects' : `View all ${filtered.length} projects`} <ArrowRight className="size-4" /></button>}
          </> : <EmptyPortfolioState unavailable={portfolioUnavailable} />}
        </div>
      </div></div>
      <AnimatePresence>{selectedProject && <CaseStudyDialog key={slugOf(selectedProject)} project={selectedProject} onClose={closeProject} />}</AnimatePresence>
    </section>
  );
}
