import { ArrowRight, Bot, CodeXml, Globe2, Layers, Smartphone, Wrench } from 'lucide-react';
import { services } from '../../data/agencyData.js';
import SectionHeader from '../ui/SectionHeader.jsx';

const icons = { 'web-apps': Globe2, 'business-software': Layers, 'mobile-apps': Smartphone, 'ai-automation': Bot, 'full-stack': CodeXml, maintenance: Wrench };
const priority = ['business-software', 'web-apps', 'mobile-apps', 'ai-automation', 'full-stack', 'maintenance'];
const ordered = [...services].sort((a,b) => priority.indexOf(a.id) - priority.indexOf(b.id));
const display = { 'business-software': 'Custom Development', 'web-apps': 'Websites & Web Apps', 'mobile-apps': 'Mobile Applications', 'ai-automation': 'AI & Automation', 'full-stack': 'Full-Stack Engineering', maintenance: 'Cloud & Support' };

export default function Services() {
  return (
    <section id="services" className="dev-section bg-white" aria-labelledby="services-heading">
      <div className="dev-container">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <SectionHeader id="services-heading" eyebrow="What we do" title={<>End-to-end digital<br />product development.</>} />
          <div className="flex max-w-[515px] flex-col gap-3 sm:flex-row sm:items-end sm:gap-8 lg:pb-1"><p className="dev-copy">From strategy to scale, we provide the expertise to turn bold ideas into powerful, real-world solutions.</p><a href="#contact" className="inline-flex min-w-max items-center gap-2 text-xs font-extrabold text-[#f44a14] hover:underline">Discuss services <ArrowRight className="size-4" /></a></div>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {ordered.map((service, index) => {
            const Icon = icons[service.id] || CodeXml;
            return <article key={service.id} className="dev-card group flex min-h-[230px] flex-col p-6 sm:p-7">
              <div className="flex items-center justify-between"><span className={`dev-icon ${index % 3 === 1 ? 'dev-icon-dark' : ''}`}><Icon className="size-6" strokeWidth={2} aria-hidden="true" /></span><ArrowRight className="size-5 text-[#ff4b16] transition-transform group-hover:translate-x-1" aria-hidden="true" /></div>
              <h3 className="mt-5 text-[19px] font-extrabold tracking-[-.04em] text-[#101b27]">{display[service.id] || service.title}</h3>
              <p className="dev-copy mt-2">{service.description}</p>
              {(service.capabilities || []).length > 0 && <div className="mt-auto flex flex-wrap gap-1.5 pt-5">{service.capabilities.slice(0, 3).map((item) => <span key={item} className="rounded-md border border-[#d1dce6] bg-[#eef4f8] px-2 py-1 text-[10px] font-semibold text-[#51697c]">{item}</span>)}</div>}
            </article>;
          })}
        </div>
      </div>
    </section>
  );
}
