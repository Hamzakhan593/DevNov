import { ArrowUpRight, Layers3 } from 'lucide-react';
import { technologies } from '../../data/agencyData.js';

export default function TechMarquee() {
  if (!technologies.length) return null;
  return (
    <section aria-label="Technologies Devnov works with" className="border-y border-white/[.075] bg-[#0c1422] py-8 sm:py-10">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-center lg:gap-9 lg:px-10">
        <div className="flex shrink-0 items-center gap-3"><span className="grid size-10 place-items-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300"><Layers3 className="size-5" aria-hidden="true" /></span><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-white">Tools of the trade</p><p className="mt-1 text-[11px] text-slate-400">Chosen for the job, not the trend</p></div></div>
        <div className="flex flex-1 flex-wrap gap-2.5">{technologies.map((tech) => <span key={tech.id} title={tech.category} className="inline-flex min-h-9 items-center rounded-lg border border-white/[.12] bg-[#1b263a] px-3.5 text-xs font-medium text-slate-200 transition hover:border-indigo-400/40">{tech.label}</span>)}</div>
        <a href="#services" className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-indigo-300 hover:text-white">Explore services <ArrowUpRight className="size-4" aria-hidden="true" /></a>
      </div>
    </section>
  );
}