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
          <SectionHeader id="services-heading" eyebrow="What we do" title="End-to-end digital product development." />
          <div className="flex max-w-[515px] flex-col gap-3 sm:flex-row sm:items-end sm:gap-8 lg:pb-1"><p className="dev-copy">From strategy to scale, we provide the expertise to turn bold ideas into powerful, real-world solutions.</p><a href="#contact" className="inline-flex min-w-max items-center gap-2 text-xs font-extrabold text-[#f44a14] hover:underline">Discuss services <ArrowRight className="size-4" /></a></div>
        </div>
        <div className="dn-service-grid">
          {ordered.map((service, index) => {
            const Icon = icons[service.iconKey] || icons[service.slug] || CodeXml;
            return <article key={service.id} className="dev-card dn-service-card group">
              <div className="dn-service-card-top"><span className={`dev-icon ${index % 3 === 1 ? 'dev-icon-dark' : ''}`}><Icon className="size-6" strokeWidth={2} aria-hidden="true" /></span><ArrowRight className="dn-service-arrow size-5 text-[#ff4b16] transition-transform group-hover:translate-x-1" aria-hidden="true" /></div>
              <div className="dn-service-copy"><h3>{service.title}</h3><p className="dev-copy">{service.description}</p></div>
              {(service.capabilities || []).length > 0 && <div className="dn-service-tags">{service.capabilities.slice(0, 3).map((item) => <span key={`${service.id}-${item}`}>{item}</span>)}</div>}
            </article>;
          })}
        </div>
      </div>
    </section>
  );
}
