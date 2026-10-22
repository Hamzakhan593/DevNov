import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Boxes, Check, Code2, Cpu, Layers3, Sparkles, Workflow } from 'lucide-react';
import { agency, technologies } from '../../data/agencyData.js';

const reveal = (reduced, delay = 0) => ({
  initial: reduced ? false : { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduced ? 0 : 0.65, delay: reduced ? 0 : delay, ease: [0.2, 0.8, 0.2, 1] },
});

function StudioIllustration({ reduced }) {
  return (
    <motion.div {...reveal(reduced, 0.28)} className="relative mx-auto w-full max-w-[560px] lg:ml-auto" aria-label="Illustration of a digital product engineering workspace">
      <div aria-hidden="true" className="pointer-events-none absolute inset-[-45px] -z-10 rounded-full bg-indigo-600/10 blur-[75px]" />
      <div className="studio-window relative overflow-hidden rounded-[22px] border border-white/[0.13] bg-[#0e1727] shadow-[0_45px_110px_rgba(0,0,0,.45),0_0_80px_rgba(99,102,241,.07)]">
        <div className="flex h-[53px] items-center justify-between border-b border-white/[0.08] bg-[#141e30] px-4 sm:px-5">
          <div className="flex items-center gap-2" aria-hidden="true"><i className="size-2.5 rounded-full bg-[#ff6b73]/75" /><i className="size-2.5 rounded-full bg-[#fbbf53]/75" /><i className="size-2.5 rounded-full bg-[#4ad89a]/75" /></div>
          <span className="flex items-center gap-2 text-[11px] font-medium tracking-wide text-slate-400"><Layers3 className="size-3.5 text-indigo-400" /> Devnov / product workspace</span>
          <span className="flex h-6 items-center rounded-md border border-white/10 px-2 text-[9px] uppercase tracking-widest text-slate-500">Concept</span>
        </div>
        <div className="grid grid-cols-[52px_1fr] sm:grid-cols-[65px_1fr]">
          <aside className="flex flex-col items-center gap-5 border-r border-white/[0.075] bg-[#101a2a] py-6 text-slate-500" aria-hidden="true">
            <span className="grid size-8 place-items-center rounded-lg bg-indigo-500/20 text-indigo-300"><Boxes className="size-4" /></span>
            <Code2 className="size-[17px]" /><Workflow className="size-[17px]" /><Cpu className="size-[17px]" />
          </aside>
          <div className="min-w-0 p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-[10px] font-medium uppercase tracking-[.15em] text-indigo-300">Build with clarity</p><h3 className="mt-2 text-lg font-semibold tracking-tight text-white sm:text-xl">From idea to product.</h3></div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">Designed to scale</span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-indigo-400/20 bg-gradient-to-br from-indigo-400/10 to-transparent p-3 sm:p-4">
                <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-400/15 text-indigo-300"><Code2 className="size-4" aria-hidden="true" /></div>
                <p className="mt-5 text-[12px] font-semibold text-white sm:text-sm">Product engineering</p>
                <p className="mt-1 text-[10px] leading-5 text-slate-400 sm:text-xs">Web & business software</p>
              </div>
              <div className="rounded-xl border border-emerald-400/15 bg-gradient-to-br from-emerald-400/[0.075] to-transparent p-3 sm:p-4">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300"><Workflow className="size-4" aria-hidden="true" /></div>
                <p className="mt-5 text-[12px] font-semibold text-white sm:text-sm">Intelligent workflows</p>
                <p className="mt-1 text-[10px] leading-5 text-slate-400 sm:text-xs">Automation & AI</p>
              </div>
            </div>
            <div className="mt-3 rounded-xl border border-white/[0.08] bg-[#172236]/75 p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between text-[10px] font-medium text-slate-400"><span>DELIVERY FLOW</span><span className="text-indigo-300">Built together</span></div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs"><span className="flex items-center gap-1.5 text-slate-300"><span className="grid size-5 place-items-center rounded-full bg-indigo-400/20 text-indigo-300"><Check className="size-3" /></span>Discover</span><span className="h-px min-w-2 flex-1 bg-gradient-to-r from-indigo-500/60 to-white/10" /><span className="flex items-center gap-1.5 text-slate-300"><span className="grid size-5 place-items-center rounded-full bg-indigo-400/20 text-indigo-300"><Check className="size-3" /></span>Build</span><span className="h-px min-w-2 flex-1 bg-white/10" /><span className="flex items-center gap-1.5 text-slate-300"><span className="grid size-5 place-items-center rounded-full border border-white/20 text-slate-400"><ArrowUpRight className="size-3" /></span>Launch</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-3 hidden rounded-xl border border-indigo-300/15 bg-[#1b2540]/95 px-4 py-3 shadow-[0_17px_40px_rgba(0,0,0,.3)] backdrop-blur-xl sm:flex sm:items-center sm:gap-3 lg:-left-9" aria-hidden="true">
        <span className="grid size-9 place-items-center rounded-lg bg-indigo-400/20 text-indigo-300"><Sparkles className="size-4" /></span>
        <span><span className="block text-[11px] font-semibold text-white">Human-centered design</span><span className="block text-[10px] text-slate-400">Crafted for real workflows</span></span>
      </div>
      <div className="mt-7 text-center text-[10px] tracking-wide text-slate-500 sm:mt-9">Illustrative interface — not a client project</div>
    </motion.div>
  );
}

export default function Hero() {
  const reduced = useReducedMotion();
  const validEmail = typeof agency.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agency.email.trim());
  const bookingUrl = typeof agency.calendlyUrl === 'string' && /^https:\/\/[^\s]+$/i.test(agency.calendlyUrl.trim()) ? agency.calendlyUrl.trim() : '';
  const secondaryHref = bookingUrl || (validEmail ? `mailto:${agency.email.trim()}` : '#process');
  const secondaryLabel = bookingUrl || validEmail ? 'Let’s talk' : 'Our approach';

  return (
    <section className="hero-surface relative isolate overflow-hidden pt-[140px] pb-20 sm:pt-[168px] sm:pb-24 lg:pt-[176px] lg:pb-28" aria-labelledby="hero-heading">
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-60" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 left-[30%] -z-10 size-[620px] rounded-full bg-indigo-600/[0.12] blur-[110px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[-150px] right-[-150px] -z-10 size-[450px] rounded-full bg-cyan-500/[0.055] blur-[100px]" />
      <div className="mx-auto grid max-w-[1240px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-10 lg:px-10">
        <div>
          <motion.div {...reveal(reduced, 0.04)} className="inline-flex max-w-full items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/[0.09] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.11em] text-indigo-200 sm:text-xs">
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.6)]" />
            Software development & AI studio
            <ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />
          </motion.div>
          <motion.h1 {...reveal(reduced, 0.12)} id="hero-heading" className="mt-7 max-w-[720px] text-[clamp(2.65rem,6vw,5rem)] leading-[1.075] font-semibold tracking-[-0.065em] text-white">
            Your vision.<br /><span className="gradient-heading">Engineered into</span><br />reality.
          </motion.h1>
          <motion.p {...reveal(reduced, 0.21)} className="mt-7 max-w-[530px] text-[15px] leading-[1.85] text-[#A6B0C3] sm:text-[17px]">
            {agency.summary} We turn ambitious ideas into thoughtful, scalable digital experiences — from first concept to final delivery.
          </motion.p>
          <motion.div {...reveal(reduced, 0.3)} className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <a className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-xl bg-[#6366F1] px-6 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(99,102,241,.25)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#7376fc] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300" href="#services">Explore what we build <ArrowRight className="size-4" aria-hidden="true" /></a>
            <a className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/[0.15] bg-white/[0.045] px-6 text-sm font-semibold text-slate-100 transition duration-200 hover:border-indigo-400/40 hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300" href={secondaryHref} {...(bookingUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{secondaryLabel}<ArrowUpRight className="size-4" aria-hidden="true" /></a>
          </motion.div>
          <motion.div {...reveal(reduced, 0.38)} className="mt-11 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/[0.08] pt-6 text-[12px] text-[#9AA8BE]">
            <span className="flex items-center gap-2"><Check className="size-4 text-emerald-400" aria-hidden="true" /> Purpose-built software</span>
            <span className="flex items-center gap-2"><Check className="size-4 text-emerald-400" aria-hidden="true" /> Clear collaboration</span>
            <span className="flex items-center gap-2"><Check className="size-4 text-emerald-400" aria-hidden="true" /> Maintainable delivery</span>
          </motion.div>
        </div>
        <StudioIllustration reduced={reduced} />
      </div>
      <div className="mx-auto mt-24 max-w-[1240px] border-t border-white/[0.07] px-5 pt-7 sm:px-8 lg:mt-28 lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="shrink-0 text-xs font-medium uppercase tracking-[0.17em] text-[#77839a]">Technologies in our toolkit</p>
          <div className="flex flex-wrap gap-2" aria-label="Technology stack">
            {technologies.slice(0, 7).map((tech) => <span key={tech.id} className="rounded-lg border border-white/[0.09] bg-white/[0.035] px-3 py-2 text-[11px] font-medium text-slate-300 transition-colors hover:border-indigo-400/30 hover:text-white sm:text-xs">{tech.label}</span>)}
          </div>
        </div>
      </div>
      <a className="sr-only" href="#services">Jump to capabilities <ArrowDownRight aria-hidden="true" /></a>
    </section>
  );
}