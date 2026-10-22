import { ArrowDownRight, ArrowUpRight, CheckCircle2, Compass, Layers3, Rocket, Wrench } from 'lucide-react';
import { processSteps } from '../../data/agencyData.js';
import SectionHeader from '../ui/SectionHeader.jsx';
const icons = { discover: Compass, plan: Layers3, build: Wrench, launch: Rocket };
const checkpoints = { discover: 'Goals, context and constraints', plan: 'Scope, architecture and milestones', build: 'Working increments and reviews', launch: 'Testing, handover and next steps' };

export default function Process() {
  return (
    <section id="process" className="scroll-mt-24 border-t border-white/[.07] bg-[#090f1a] py-24 sm:py-28 lg:py-32" aria-labelledby="process-heading">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          <div><SectionHeader eyebrow="Our approach" id="process-heading" title={<>A clear path from <span className="text-indigo-300">problem to product.</span></>} description="We start by listening. Then we design a practical roadmap, build in manageable stages and verify the product before launch." />
            <div className="mt-9 rounded-2xl border border-indigo-400/20 bg-indigo-500/[.075] p-6"><CheckCircle2 className="size-6 text-indigo-300" aria-hidden="true"/><p className="mt-4 text-sm font-semibold text-slate-100">Clarity at every milestone</p><p className="mt-2 text-sm leading-7 text-slate-400">Clear responsibilities, review points and decisions help keep the work aligned with your goals.</p></div>
            <a href="#contact" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-5 text-sm font-semibold text-white transition hover:bg-white/[.07]">Talk through your idea <ArrowUpRight className="size-4" aria-hidden="true" /></a></div>
          <ol className="grid gap-4 sm:grid-cols-2">{processSteps.map((step, index) => { const Icon = icons[step.id] || Compass; return <li key={step.id} className="relative flex min-h-[225px] flex-col rounded-[22px] border border-[#2b3950] bg-[#172337] p-7 shadow-[0_14px_38px_rgba(0,0,0,.13)]"><div className="flex items-center justify-between"><span className="text-xs font-bold tracking-[.2em] text-indigo-300">STEP {String(index + 1).padStart(2,'0')}</span><Icon className="size-5 text-indigo-200" aria-hidden="true" /></div><h3 className="mt-9 text-[22px] font-semibold tracking-tight text-white">{step.title}</h3><p className="mt-3 text-sm leading-7 text-slate-400">{step.description}</p><p className="mt-auto pt-5 text-xs leading-6 text-slate-300"><span className="mr-2 text-indigo-300">↳</span>{checkpoints[step.id] || 'A clear next step'}</p>{index < processSteps.length - 1 && <ArrowDownRight className="absolute bottom-5 right-5 size-4 text-slate-600" aria-hidden="true" />}</li>; })}</ol>
        </div>
      </div>
    </section>
  );
}