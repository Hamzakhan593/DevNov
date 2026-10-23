import { ArrowRight, Code2, ExternalLink, Github, ImageIcon } from 'lucide-react';
const safeLink = (value) => typeof value === 'string' && /^https:\/\/[^\s]+$/i.test(value.trim());
const safeImage = (value) => typeof value === 'string' && (safeLink(value) || /^\/projects\/[a-zA-Z0-9._-]+\.(png|jpg|jpeg|webp|avif)$/i.test(value));
export default function ProjectCard({ project, onDetails }) {
  const tools = Array.isArray(project.technologies) ? project.technologies : [];
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#d3dde6] bg-white shadow-[0_12px_26px_rgba(0,0,0,.16)] transition hover:-translate-y-1 hover:shadow-[0_19px_34px_rgba(0,0,0,.23)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#eaf0f5]">
        {safeImage(project.image) ? <img src={project.image} alt={project.imageAlt || `${project.title} product screenshot`} loading="lazy" decoding="async" className="h-full w-full object-cover object-top transition-transform group-hover:scale-[1.03]" /> : <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#dfe9f0] text-[#617589]"><Code2 className="size-11" /><span className="flex items-center gap-2 text-xs"><ImageIcon className="size-3.5" /> Screenshot pending</span></div>}
      </div>
      <div className="flex flex-1 flex-col p-5"><div className="flex items-start justify-between gap-2"><div><span className="text-[10px] font-bold text-[#f04915]">{project.demo ? 'DEMO CONCEPT · ' : ''}{project.category || 'Software'}</span><h3 className="mt-1 text-[19px] font-extrabold tracking-tight text-[#101b27]">{project.title}</h3></div><button type="button" onClick={onDetails} aria-label={`Read case study: ${project.title}`} className="grid size-9 shrink-0 place-items-center rounded-full bg-[#101b27] text-white transition hover:bg-[#ff4b16]"><ArrowRight className="size-4" /></button></div><p className="mt-2 flex-1 text-xs leading-6 text-[#53697b]">{project.summary}</p>
        {tools.length > 0 && <div className="mt-4 flex flex-wrap gap-1.5">{tools.slice(0,4).map((tool) => <span key={tool} className="rounded border border-[#d7e1e9] bg-[#f1f5f8] px-2 py-1 text-[10px] font-bold text-[#566f82]">{tool}</span>)}</div>}
        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-[#d7e1e9] pt-4"><button type="button" onClick={onDetails} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f04915]">{project.demo ? 'Preview concept' : 'Case study'} <ArrowRight className="size-3.5" /></button>{safeLink(project.liveUrl) && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#53697b]">Live <ExternalLink className="size-3.5" /></a>}{safeLink(project.repositoryUrl) && <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#53697b]">Code <Github className="size-3.5" /></a>}</div>
      </div>
    </article>
  );
}
