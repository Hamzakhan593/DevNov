import { ArrowRight, ArrowUpRight, Code2, ExternalLink, Github, ImageIcon } from 'lucide-react';

const safeLink = (value) => typeof value === 'string' && /^https:\/\/[^\s]+$/i.test(value.trim());
const safeImage = (value) => typeof value === 'string' && /^\/projects\/[a-zA-Z0-9._-]+\.(png|jpg|jpeg|webp|avif)$/i.test(value);

export default function ProjectCard({ project, onDetails }) {
  const tools = Array.isArray(project.technologies) ? project.technologies : [];
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-white/[0.13] bg-[#192538] shadow-[0_20px_70px_rgba(0,0,0,.16)] transition duration-300 hover:-translate-y-1 hover:border-indigo-300/35 hover:shadow-[0_24px_80px_rgba(28,37,85,.30)]">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-white/[0.09] bg-[#121F32]">
        {safeImage(project.image) ? <img src={project.image} alt={project.imageAlt || `${project.title} product screenshot`} loading="lazy" decoding="async" className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.025]" /> :
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_30%_25%,rgba(99,102,241,.22),transparent_55%),linear-gradient(145deg,#172641,#101827)]"><div className="grid size-16 place-items-center rounded-2xl border border-indigo-300/20 bg-indigo-400/[0.08]"><Code2 className="size-8 text-indigo-200/70" aria-hidden="true" /></div><p className="flex items-center gap-2 text-xs font-medium text-slate-400"><ImageIcon className="size-4" aria-hidden="true" /> Project image not added</p></div>}
        <span className="absolute bottom-4 left-4 rounded-lg border border-white/15 bg-[#0C1422]/85 px-3 py-1.5 text-[11px] font-medium text-indigo-100 backdrop-blur-md">{project.category || 'Software'}</span>
      </div>
      <div className="flex flex-1 flex-col px-6 pb-6 pt-6 sm:px-7 sm:pb-7">
        <div className="flex items-start justify-between gap-3"><h3 className="max-w-[440px] text-xl font-semibold tracking-[-.028em] text-white sm:text-[22px]">{project.title}</h3><button type="button" onClick={onDetails} aria-label={`Read case study: ${project.title}`} className="grid size-10 shrink-0 place-items-center rounded-xl border border-indigo-300/20 bg-indigo-500/10 text-indigo-300 transition hover:border-indigo-300/60 hover:bg-indigo-500/20"><ArrowUpRight className="size-5" aria-hidden="true" /></button></div>
        <p className="mt-3 line-clamp-3 text-[13px] leading-7 text-[#AEB9C9] sm:text-sm">{project.summary}</p>
        {tools.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{tools.slice(0, 6).map((tool) => <span key={tool} className="rounded-lg border border-white/[0.09] bg-[#25334A] px-2.5 py-1.5 text-[11px] font-medium text-slate-300">{tool}</span>)}</div>}
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/[0.10] pt-5" style={{ marginTop: 'auto', paddingTop: 20 }}>
          <button type="button" onClick={onDetails} className="inline-flex items-center gap-2 rounded-md text-sm font-semibold text-indigo-200 transition hover:text-white focus-visible:outline-2 focus-visible:outline-indigo-300">Case study <ArrowRight className="size-4" aria-hidden="true" /></button>
          {safeLink(project.liveUrl) && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md text-xs font-medium text-slate-400 transition hover:text-indigo-200" aria-label={`Open live demo of ${project.title} in new tab`}>Live demo <ExternalLink className="size-3.5" aria-hidden="true" /></a>}
          {safeLink(project.repositoryUrl) && <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md text-xs font-medium text-slate-400 transition hover:text-indigo-200" aria-label={`Open repository for ${project.title} in new tab`}>Code <Github className="size-3.5" aria-hidden="true" /></a>}
        </div>
      </div>
    </article>
  );
}