import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, FolderOpen, Layers3, Sparkles } from 'lucide-react';
import { projects as legacyProjects } from '../../data/agencyData.js';
import managedProjects from '../../data/projects.json';
import ProjectCard from '../ui/ProjectCard.jsx';
import CaseStudyDialog from '../ui/CaseStudyDialog.jsx';

const isPublished = (project) => project && project.published !== false && project.title && project.summary;
const slugOf = (project) => String(project.slug || project.id || '');
const allProjects = [...managedProjects, ...legacyProjects]
  .filter(isPublished)
  .filter((project, index, entries) => entries.findIndex((other) => slugOf(other) === slugOf(project)) === index)
  .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

export default function FeaturedWork() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const reducedMotion = useReducedMotion();
  const categories = useMemo(() => ['All', ...new Set(allProjects.map((item) => item.category || 'Software'))], []);
  const filtered = useMemo(() => activeCategory === 'All' ? allProjects : allProjects.filter((item) => (item.category || 'Software') === activeCategory), [activeCategory]);
  const visible = showAll ? filtered : filtered.slice(0, 6);

  return (
    <section id="work" aria-labelledby="work-heading" className="relative scroll-mt-20 overflow-hidden border-t border-white/[0.08] bg-[#0B1321] py-20 sm:py-24 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 size-[500px] rounded-full bg-indigo-500/[0.055] blur-3xl" />
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between lg:gap-14">
          <div className="max-w-[760px]">
            <p className="eyebrow">Selected work / Engineering in practice</p>
            <h2 id="work-heading" className="mt-4 text-[34px] font-semibold tracking-[-.055em] text-white sm:text-[43px] lg:text-[52px] lg:leading-[1.12]">Ideas shaped into <span className="gradient-heading">real products.</span></h2>
            <p className="mt-5 max-w-[680px] text-sm leading-8 text-[#A8B5C9] sm:text-[15px]">Explore what we've built, how we've approached the challenge, and the engineering behind each product. Every published project is added by the Devnov team.</p>
          </div>
          {allProjects.length > 0 && <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/[0.1] bg-[#17243A] px-5 py-4 text-sm text-slate-300"><Layers3 aria-hidden="true" className="size-5 text-indigo-300" /><span>{allProjects.length} showcased {allProjects.length === 1 ? 'project' : 'projects'}</span></div>}
        </div>
        {allProjects.length ? (
          <>
            {categories.length > 2 && <div className="-mx-1 mt-11 flex gap-2 overflow-x-auto px-1 pb-3" aria-label="Filter projects by category">
              {categories.map((category) => <button type="button" key={category} onClick={() => { setActiveCategory(category); setShowAll(false); }} aria-pressed={activeCategory === category} className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 ${activeCategory === category ? 'border-indigo-300/50 bg-indigo-500/20 text-indigo-100' : 'border-white/[.12] bg-white/[.035] text-slate-400 hover:border-white/25 hover:text-white'}`}>{category}</button>)}
            </div>}
            <div className="mt-9 grid items-stretch gap-5 md:grid-cols-2 xl:gap-7">
              {visible.map((project, index) => <motion.div key={slugOf(project)} initial={reducedMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.38, delay: reducedMotion ? 0 : Math.min(index, 3) * 0.05 }}><ProjectCard project={project} onDetails={() => setSelectedProject(project)} /></motion.div>)}
            </div>
            {filtered.length > 6 && <div className="mt-11 flex justify-center"><button type="button" onClick={() => setShowAll((shown) => !shown)} className="inline-flex items-center gap-2 rounded-xl border border-indigo-300/25 bg-[#19253A] px-6 py-3 text-sm font-semibold text-indigo-100 transition hover:border-indigo-300/50 hover:bg-[#24324D]">{showAll ? 'Show featured selection' : `View all ${filtered.length} projects`} <ArrowRight className="size-4" aria-hidden="true" /></button></div>}
          </>
        ) : (
          <div className="mt-11 grid overflow-hidden rounded-[24px] border border-white/[0.13] bg-[#151F30] shadow-[0_22px_65px_rgba(0,0,0,.14)] lg:grid-cols-[1.15fr_.85fr]">
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14"><span className="mb-7 grid size-14 place-items-center rounded-2xl border border-indigo-300/25 bg-indigo-500/10"><FolderOpen className="size-7 text-indigo-300" aria-hidden="true" /></span><h3 className="text-2xl font-semibold tracking-[-.035em] text-white sm:text-3xl">Our portfolio is taking shape.</h3><p className="mt-4 max-w-[510px] text-sm leading-8 text-slate-400">We’re curating real project stories, screenshots and technical details. The first case studies will appear here as they’re published.</p><a href="#services" className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-indigo-300 transition hover:text-indigo-100">Explore our capabilities <ArrowUpRight className="size-4" aria-hidden="true" /></a></div>
            <div className="relative flex min-h-[270px] items-center justify-center overflow-hidden border-t border-white/10 bg-[radial-gradient(ellipse_at_80%_30%,rgba(99,102,241,.14),transparent_60%),#111B2D] p-10 lg:border-l lg:border-t-0">
              <div aria-hidden="true" className="absolute inset-0 opacity-25" style={{ backgroundImage: 'linear-gradient(rgba(165,180,252,.08) 1px, transparent 1px), linear-gradient(90deg,rgba(165,180,252,.08) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
              <div className="relative w-full max-w-[300px] rotate-[-4deg] rounded-xl border border-indigo-200/20 bg-[#1E2C43] p-5 shadow-[22px_24px_45px_rgba(0,0,0,.25)]"><div className="flex gap-1.5"><span className="size-2 rounded-full bg-rose-300/50" /><span className="size-2 rounded-full bg-amber-300/50" /><span className="size-2 rounded-full bg-emerald-300/50" /></div><div className="mt-7 h-3 w-3/4 rounded bg-indigo-300/30" /><div className="mt-4 h-2 w-full rounded bg-slate-500/20" /><div className="mt-2 h-2 w-5/6 rounded bg-slate-500/20" /><div className="mt-8 flex gap-3"><div className="h-20 flex-1 rounded-lg border border-indigo-300/15 bg-indigo-400/10" /><div className="h-20 flex-1 rounded-lg border border-indigo-300/15 bg-indigo-400/10" /></div><span className="mt-6 flex items-center gap-2 text-xs text-indigo-300"><Sparkles className="size-3.5" /> Case studies / Coming soon</span></div>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>{selectedProject && <CaseStudyDialog key={slugOf(selectedProject)} project={selectedProject} onClose={() => setSelectedProject(null)} />}</AnimatePresence>
    </section>
  );
}