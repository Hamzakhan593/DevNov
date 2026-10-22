import { Braces, Eye, FileCheck2, Gauge, MessageSquareText, ShieldCheck } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader.jsx';
const principles = [
  { title: 'Built around your actual need', text: 'We start with the business problem before choosing a framework or feature list.', Icon: Eye },
  { title: 'Practical technical decisions', text: 'Architecture, integrations and deployment choices should fit the product and its constraints.', Icon: Braces },
  { title: 'Quality over shortcuts', text: 'Readable code, thoughtful interfaces and sensible testing are part of the delivery approach.', Icon: FileCheck2 },
  { title: 'Clear communication', text: 'Review milestones and explicit scope help you understand the work being done.', Icon: MessageSquareText },
  { title: 'Responsible implementation', text: 'We consider privacy, security and safe defaults where the application requires them.', Icon: ShieldCheck },
  { title: 'Performance in mind', text: 'We aim for responsive user experiences, measured improvements and maintainable systems.', Icon: Gauge },
];
export default function WhyUs() {
  return (
    <section id="why-devnov" className="scroll-mt-24 border-t border-white/[.07] bg-[#111b2c] py-24 sm:py-28 lg:py-32" aria-labelledby="why-heading">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16"><div><SectionHeader eyebrow="How we think" id="why-heading" title={<>A studio mindset. <span className="text-indigo-300">No unnecessary noise.</span></>} description="We focus on understanding, craftsmanship and communication rather than inflated promises or made-up success numbers." />
          <div className="mt-8 rounded-2xl border border-white/[.12] bg-[#1d2b42] p-6 text-sm leading-7 text-slate-300">Our work will speak for itself through genuine case studies and clear explanations of what was built.</div></div>
          <div className="grid gap-4 sm:grid-cols-2">{principles.map(({title,text,Icon}) => <article key={title} className="rounded-[20px] border border-[#35445d] bg-[#1d2c43] p-6 transition-colors hover:border-indigo-300/40"><Icon className="size-6 text-indigo-300" strokeWidth={1.6} aria-hidden="true" /><h3 className="mt-5 text-[16px] font-semibold text-slate-50">{title}</h3><p className="mt-3 text-sm leading-7 text-[#abb8cb]">{text}</p></article>)}</div>
        </div>
      </div>
    </section>
  );
}