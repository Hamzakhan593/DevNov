import { ArrowRight, Layers3 } from 'lucide-react';
import { technologies } from '../../data/agencyData.js';
export default function TechMarquee() {
  if (!technologies.length) return null;
  return <section aria-label="Technologies DevNov works with" className="border-y border-[#e0e7ee] bg-[#f7f9fc] py-5"><div className="dev-container flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6"><div className="flex shrink-0 items-center gap-2 text-xs font-extrabold text-[#101b27]"><Layers3 className="size-5 text-[#ff4b16]" />Our stack</div><div className="flex flex-1 flex-wrap gap-2">{technologies.map((tech) => <span key={tech.id} title={tech.category} className="rounded-lg border border-[#cfdae4] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#4e6477] shadow-sm">{tech.label}</span>)}</div><a href="#services" className="inline-flex shrink-0 items-center gap-1 text-[11px] font-extrabold text-[#f34b1a]">Services <ArrowRight className="size-3.5" /></a></div></section>;
}
