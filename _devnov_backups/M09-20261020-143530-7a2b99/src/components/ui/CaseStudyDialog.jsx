import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Github, X } from 'lucide-react';

const safeLink = (value) => typeof value === 'string' && /^https:\/\/[^\s]+$/i.test(value.trim());
const safeImage = (value) => typeof value === 'string' && /^\/projects\/[a-zA-Z0-9._-]+\.(png|jpg|jpeg|webp|avif)$/i.test(value);

export default function CaseStudyDialog({ project, onClose }) {
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    previousFocus.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key === 'Tab' && dialogRef.current) {
        const focusables = [...dialogRef.current.querySelectorAll('a[href], button:not([disabled])')];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first) { event.preventDefault(); dialogRef.current.focus(); return; }
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus?.();
    };
  }, [onClose]);

  const details = [['The challenge', project.challenge], ['Our approach', project.solution], ['Outcome', project.outcome]].filter(([, value]) => typeof value === 'string' && value.trim());
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.17 }} className="fixed inset-0 z-[90] flex items-center justify-center bg-[#060912]/90 p-3 backdrop-blur-lg sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="devnov-case-study-title" tabIndex={-1} initial={reducedMotion ? false : { opacity: 0, y: 18, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} className="relative max-h-[min(90vh,900px)] w-full max-w-[900px] overflow-y-auto overscroll-contain rounded-[22px] border border-white/20 bg-[#162237] shadow-[0_30px_100px_rgba(0,0,0,.65)] outline-none">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#162237]/95 px-6 py-4 backdrop-blur-xl sm:px-8"><span className="text-xs font-semibold uppercase tracking-[.14em] text-orange-300">DevNov / Case study</span><button type="button" onClick={onClose} aria-label="Close case study" className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[.06] text-white transition hover:bg-white/15"><X className="size-5" aria-hidden="true" /></button></div>
        {safeImage(project.image) && <div className="max-h-[420px] overflow-hidden border-b border-white/10 bg-[#0c1321]"><img src={project.image} alt={project.imageAlt || `${project.title} screenshot`} className="max-h-[420px] w-full object-contain" /></div>}
        <div className="px-6 pb-9 pt-9 sm:px-10 sm:pb-11"><span className="rounded-full border border-indigo-300/20 bg-orange-600/10 px-3 py-1.5 text-xs text-orange-200">{project.category || 'Software'}</span><h2 id="devnov-case-study-title" className="mt-5 text-3xl font-semibold tracking-[-.045em] text-white sm:text-4xl">{project.title}</h2><p className="mt-4 text-base leading-8 text-slate-300">{project.summary}</p>
          {Array.isArray(project.technologies) && project.technologies.length > 0 && <div className="mt-6 flex flex-wrap gap-2">{project.technologies.map((tech) => <span key={tech} className="rounded-lg border border-white/10 bg-[#23314A] px-3 py-2 text-xs text-slate-200">{tech}</span>)}</div>}
          {details.length > 0 && <div className="mt-9 grid gap-4 sm:grid-cols-2">{details.map(([label, value]) => <section key={label} className="rounded-2xl border border-white/[.1] bg-[#1E2D43] p-6"><h3 className="text-sm font-semibold text-orange-200">{label}</h3><p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">{value}</p></section>)}</div>}
          {(safeLink(project.liveUrl) || safeLink(project.repositoryUrl)) && <div className="mt-9 flex flex-wrap gap-3">{safeLink(project.liveUrl) && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-orange-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-400">Visit live project <ExternalLink className="size-4" aria-hidden="true" /></a>}{safeLink(project.repositoryUrl) && <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-5 text-sm font-semibold text-white transition hover:border-indigo-300/50">View source <Github className="size-4" aria-hidden="true" /></a>}</div>}
          <p className="mt-8 flex items-center gap-2 text-xs text-slate-500">Built by DevNov <ArrowUpRight className="size-3.5" aria-hidden="true" /></p>
        </div>
      </motion.div>
    </motion.div>
  );
}