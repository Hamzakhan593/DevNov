import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, FolderOpen } from 'lucide-react';
import { demoEnabled, demoProjects } from '../../data/demoContent.js';
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

export default function FeaturedWork() {
  const { projects: publicProjects } = usePublicContent();
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const publishedProjects = useMemo(() => (Array.isArray(publicProjects) ? publicProjects : [])
    .filter(isPublished)
    .filter((project, index, entries) => entries.findIndex((other) => slugOf(other) === slugOf(project)) === index)
    .sort(compareProjects), [publicProjects]);
  const showingDemo = demoEnabled && publishedProjects.length === 0;
  const allProjects = useMemo(() => showingDemo ? demoProjects : publishedProjects, [publishedProjects, showingDemo]);

  useEffect(() => {
    const syncWithLocation = () => {
      const slug = new URLSearchParams(window.location.search).get('project');
      setSelectedProject(slug ? allProjects.find((entry) => slugOf(entry) === slug) || null : null);
    };
    syncWithLocation();
    window.addEventListener('popstate', syncWithLocation);
    return () => window.removeEventListener('popstate', syncWithLocation);
  }, [allProjects]);
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
  const reducedMotion = useReducedMotion();
  const categories = useMemo(() => ['All', ...new Set(allProjects.map((item) => item.category || 'Software'))], []);
  const filtered = useMemo(() => activeCategory === 'All' ? allProjects : allProjects.filter((item) => (item.category || 'Software') === activeCategory), [activeCategory]);
  const visible = showAll ? filtered : filtered.slice(0, 6);
  return (
    <section id="work" className="scroll-mt-24 bg-[#f7f9fc] py-7 sm:py-10" aria-labelledby="work-heading">
      <div className="dev-container"><div className="dev-featured px-6 py-10 sm:px-9 sm:py-12 lg:px-11">
        <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr] lg:gap-10">
          <div className="flex flex-col items-start"><p className="eyebrow">Featured work</p><h2 id="work-heading" className="mt-3 text-[clamp(2.25rem,3.8vw,3.5rem)] leading-[1.08] font-extrabold tracking-[-.06em] text-white">{showingDemo ? <>Explore sample<br />projects.</> : <>Real projects.<br />Real impact.</>}</h2><p className="mt-5 max-w-[340px] text-sm leading-7 text-[#b6c4d0]">{showingDemo ? 'Explore 12 illustrative design concepts to preview the DevNov portfolio layout. These are not real client projects or completed work.' : 'A closer look at products we have built. Published case studies include verified project details and approved screenshots.'}</p><a href="#contact" className="dev-primary mt-6">Start a Project <ArrowRight className="size-4" /></a></div>
          <div className="min-w-0">
            {showingDemo && <p role="note" className="mb-4 rounded-xl border border-[#ff9a73] bg-[#fff2eb] px-4 py-3 text-xs font-bold leading-5 text-[#873814]">DEMO PREVIEW — All case studies and screenshots below are illustrative concepts, not client work.</p>}
            {allProjects.length ? <>
              <div className="flex flex-wrap gap-2 pb-4" aria-label="Filter projects by category">{categories.map((category) => <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => { setActiveCategory(category); setShowAll(false); }} className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${activeCategory === category ? 'border-[#ff4b16] bg-[#ff4b16] text-white' : 'border-[#435263] bg-[#24323f] text-[#c6d2de] hover:border-[#ff946e]'}`}>{category}</button>)}</div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">{visible.map((project, index) => <motion.div key={slugOf(project)} initial={reducedMotion ? false : {opacity:0,y:13}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.32,delay:reducedMotion?0:Math.min(index,4)*.05}}><ProjectCard project={project} onDetails={() => openProject(project)} /></motion.div>)}</div>
              {filtered.length > 6 && <button type="button" onClick={() => setShowAll((shown) => !shown)} className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#ff8d65] hover:underline">{showAll ? 'Show less' : `View all ${filtered.length} projects`} <ArrowRight className="size-4" /></button>}
            </> : <div className="flex h-full min-h-[260px] flex-col justify-center rounded-2xl border border-[#405163] bg-[#1c2a38] p-7 sm:p-10"><div className="grid size-14 place-items-center rounded-xl bg-[#314353] text-[#ff875c]"><FolderOpen className="size-7" /></div><h3 className="mt-6 text-2xl font-extrabold tracking-tight text-white">Our portfolio is taking shape.</h3><p className="mt-3 max-w-[470px] text-sm leading-7 text-[#b9c7d4]">We will publish real products and case studies here after their details and images have been approved. No sample clients or invented results.</p><a href="#services" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#ff9b75]">Explore our capabilities <ArrowUpRight className="size-4" /></a></div>}
          </div>
        </div>
      </div></div>
      <AnimatePresence>{selectedProject && <CaseStudyDialog key={slugOf(selectedProject)} project={selectedProject} onClose={closeProject} />}</AnimatePresence>
    </section>
  );
}
