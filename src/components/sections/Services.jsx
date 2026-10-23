import { useMemo } from 'react';
import { ArrowRight, BarChart3, Bot, Cloud, CodeXml, Globe2, Layers, Paintbrush, PlugZap, ShoppingBag, Smartphone, UsersRound, Wrench } from 'lucide-react';
import { usePublicContent } from '../../context/PublicContentContext.jsx';
import SectionHeader from '../ui/SectionHeader.jsx';

const icons = { 'web-apps': Globe2, 'business-software': Layers, 'mobile-apps': Smartphone, 'ai-automation': Bot, 'full-stack': CodeXml, maintenance: Wrench, 'crm-erp': UsersRound, ecommerce: ShoppingBag, 'product-design': Paintbrush, 'api-integrations': PlugZap, analytics: BarChart3, 'cloud-devops': Cloud };
const priority = ['business-software', 'web-apps', 'mobile-apps', 'ai-automation', 'full-stack', 'maintenance'];
const rank = (service) => { const index = priority.indexOf(service.slug || service.id); return index === -1 ? priority.length : index; };
const compareServices = (left, right) => {
  const leftOrder = Number.isFinite(left.sortOrder) ? left.sortOrder : null;
  const rightOrder = Number.isFinite(right.sortOrder) ? right.sortOrder : null;
  if (leftOrder !== null || rightOrder !== null) return (leftOrder ?? Number.MAX_SAFE_INTEGER) - (rightOrder ?? Number.MAX_SAFE_INTEGER);
  return rank(left) - rank(right);
};

export default function Services() {
  const { services } = usePublicContent();
  const ordered = useMemo(() => (Array.isArray(services) ? [...services] : []).sort(compareServices), [services]);

  return (
    <section id="services" className="dev-section bg-white" aria-labelledby="services-heading">
      <div className="dev-container">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <SectionHeader id="services-heading" eyebrow="What we do" title={<>End-to-end digital<br />product development.</>} />
          <div className="flex max-w-[515px] flex-col gap-3 sm:flex-row sm:items-end sm:gap-8 lg:pb-1"><p className="dev-copy">From strategy to scale, we provide the expertise to turn bold ideas into powerful, real-world solutions.</p><a href="#contact" className="inline-flex min-w-max items-center gap-2 text-xs font-extrabold text-[#f44a14] hover:underline">Discuss services <ArrowRight className="size-4" /></a></div>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {ordered.map((service, index) => {
            const Icon = icons[service.iconKey] || icons[service.slug] || CodeXml;
            return <article key={service.id} className="dev-card group flex min-h-[230px] flex-col p-6 sm:p-7">
              <div className="flex items-center justify-between"><span className={`dev-icon ${index % 3 === 1 ? 'dev-icon-dark' : ''}`}><Icon className="size-6" strokeWidth={2} aria-hidden="true" /></span><ArrowRight className="size-5 text-[#ff4b16] transition-transform group-hover:translate-x-1" aria-hidden="true" /></div>
              <h3 className="mt-5 text-[19px] font-extrabold tracking-[-.04em] text-[#101b27]">{service.title}</h3>
              <p className="dev-copy mt-2">{service.description}</p>
              {(service.capabilities || []).length > 0 && <div className="mt-auto flex flex-wrap gap-1.5 pt-5">{service.capabilities.slice(0, 3).map((item) => <span key={`${service.id}-${item}`} className="rounded-md border border-[#d1dce6] bg-[#eef4f8] px-2 py-1 text-[10px] font-semibold text-[#51697c]">{item}</span>)}</div>}
            </article>;
          })}
        </div>
      </div>
    </section>
  );
}
