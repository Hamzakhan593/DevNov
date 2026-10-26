import { ArrowRight, Code2, ExternalLink, Github, ImageIcon } from 'lucide-react';
const safeLink = (value) => typeof value === 'string' && /^https:\/\/[^\s]+$/i.test(value.trim());
const safeImage = (value) => typeof value === 'string' && (safeLink(value) || /^\/projects\/[a-zA-Z0-9._-]+\.(png|jpg|jpeg|webp|avif)$/i.test(value));
export default function ProjectCard({ project, onDetails }) {
  const tools = Array.isArray(project.technologies) ? project.technologies : [];
  const category = project.category || 'Software';
  const label = project.demo ? 'Concept preview' : category;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#d1dde6] bg-white shadow-[0_14px_28px_rgba(0,0,0,.16)] transition duration-300 hover:-translate-y-1 hover:border-[#fb9a7b] hover:shadow-[0_22px_42px_rgba(0,0,0,.25)]">
      <div className="relative aspect-[16/9] overflow-hidden bg-[#eaf0f5]">
        {safeImage(project.image) ? <><img src={project.image} alt={project.imageAlt || `${project.title} product screenshot`} loading="lazy" decoding="async" className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.045]" /><div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08131f]/35 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" /></> : <div className="flex h-full flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,#dce8f0,#f4f7fa)] text-[#617589]"><span className="grid size-12 place-items-center rounded-2xl border border-[#c6d6e1] bg-white/70"><Code2 className="size-6" /></span><span className="flex items-center gap-2 text-xs font-semibold"><ImageIcon className="size-3.5" /> Screenshot coming soon</span></div>}
        <span className="absolute left-4 top-4 rounded-full border border-white/55 bg-[#102131]/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.06em] text-white shadow-sm backdrop-blur-sm">{label}</span>
      </div>
      <div className="flex flex-1 flex-col p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.055em] text-[#e85223]">{project.demo ? 'Illustrative concept' : 'Published case study'}</p><h3 className="mt-1.5 text-[19px] font-extrabold tracking-[-.035em] text-[#101b27]">{project.title}</h3></div><button type="button" onClick={onDetails} aria-label={`Read case study: ${project.title}`} className="grid size-9 shrink-0 place-items-center rounded-full bg-[#101b27] text-white transition hover:bg-[#ff4b16] focus-visible:bg-[#ff4b16]"><ArrowRight className="size-4" /></button></div><p className="mt-3 flex-1 text-xs leading-6 text-[#53697b]">{project.summary}</p>
        {tools.length > 0 && <div className="mt-5 flex flex-wrap gap-1.5">{tools.slice(0, 4).map((tool) => <span key={tool} className="rounded-md border border-[#d7e1e9] bg-[#f1f5f8] px-2 py-1 text-[10px] font-bold text-[#566f82]">{tool}</span>)}</div>}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#d7e1e9] pt-4"><button type="button" onClick={onDetails} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e85223] transition hover:text-[#bd350e] hover:underline">{project.demo ? 'Preview concept' : 'Read case study'} <ArrowRight className="size-3.5" /></button>{safeLink(project.liveUrl) && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-[#53697b] transition hover:text-[#101b27]">Project link <ExternalLink className="size-3.5" /></a>}{safeLink(project.repositoryUrl) && <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-[#53697b] transition hover:text-[#101b27]">Source <Github className="size-3.5" /></a>}</div>
      </div>
    </article>
  );
}
