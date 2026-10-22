import { ArrowUpRight, BrainCircuit, CodeXml, DatabaseZap, Globe2, Smartphone, Wrench } from 'lucide-react';
import { services } from '../../data/agencyData.js';
import SectionHeader from '../ui/SectionHeader.jsx';

const icons = { 'web-apps': Globe2, 'business-software': DatabaseZap, 'mobile-apps': Smartphone, 'ai-automation': BrainCircuit, 'full-stack': CodeXml, maintenance: Wrench };
const labels = { 'web-apps': 'Digital presence', 'business-software': 'Operations', 'mobile-apps': 'Mobile products', 'ai-automation': 'Intelligent systems', 'full-stack': 'End-to-end', maintenance: 'Long-term support' };

export default function Services() {
  return (
    <section id="services" className="scroll-mt-24 border-t border-white/[0.08] bg-[#101827] py-24 sm:py-28 lg:py-32" aria-labelledby="services-heading">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <SectionHeader id="services-heading" eyebrow="What we do" title={<>Your idea deserves more than <span className="text-indigo-300">generic software.</span></>} description="From high-performance websites to intelligent workflows, we shape every solution around the problem it needs to solve." />
          <a className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-xl border border-indigo-400/30 bg-indigo-400/10 px-5 text-sm font-semibold text-indigo-200 transition hover:border-indigo-300 hover:bg-indigo-400/20" href="#contact">Discuss your project <ArrowUpRight className="size-4" aria-hidden="true" /></a>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = icons[service.id] || CodeXml;
            return (
              <article key={service.id} className="group flex h-full flex-col rounded-[23px] border border-[#35445f]/65 bg-[#1b2940] p-7 shadow-[0_22px_50px_rgba(1,4,15,.18)] transition-[border-color,transform,background-color] duration-300 hover:-translate-y-1 hover:border-indigo-400/60 hover:bg-[#20304b] sm:p-8">
                <div className="flex items-start justify-between gap-4"><div className="grid size-13 place-items-center rounded-[14px] border border-indigo-300/20 bg-[#303d68] text-indigo-200"><Icon className="size-6" strokeWidth={1.8} aria-hidden="true" /></div><span className="font-mono text-[11px] text-slate-500">0{index + 1}</span></div>
                <p className="mt-8 text-[11px] font-semibold uppercase tracking-[.17em] text-indigo-300">{labels[service.id] || 'Engineering'}</p>
                <h3 className="mt-3 text-[21px] font-semibold leading-7 tracking-tight text-white">{service.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-[#afbed2]">{service.description}</p>
                <div className="mt-7 flex min-h-[36px] flex-wrap gap-2">{(service.capabilities || []).map((capability) => <span key={capability} className="rounded-lg border border-white/[.12] bg-black/[.14] px-3 py-1.5 text-xs text-slate-300">{capability}</span>)}</div>
                <a className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-indigo-200 transition group-hover:text-white" href="#contact" aria-label={`Discuss ${service.title}`}>Discuss this service <ArrowUpRight className="size-4" aria-hidden="true" /></a>
              </article>
            );
          })}
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/[.10] bg-[#151f30] px-6 py-6 sm:flex-row sm:items-center sm:px-8"><p className="text-sm leading-7 text-slate-300">Not sure which approach fits? Tell us the business goal and we can explore suitable options together.</p><a href="#process" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-indigo-100">See our process <ArrowUpRight className="size-4" aria-hidden="true" /></a></div>
      </div>
    </section>
  );
}