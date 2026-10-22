import { ArrowRight, Blocks, Headphones, Lightbulb, Palette } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader.jsx';
const items = [
  { title: 'Strategy-First Thinking', description: 'We take time to understand your goals, users and market to build the right solution.', Icon: Lightbulb },
  { title: 'Modern UI/UX', description: 'Clean, intuitive designs that engage users and make complex things feel simple.', Icon: Palette },
  { title: 'Scalable Development', description: 'Modern engineering decisions made with future growth in mind.', Icon: Blocks },
  { title: 'Long-Term Support', description: 'We can help maintain and improve products after launch.', Icon: Headphones },
];
export default function WhyUs() {
  return <section id="why-devnov" className="dev-section bg-[#f7f9fc]" aria-labelledby="why-heading"><div className="dev-container"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><SectionHeader id="why-heading" eyebrow="Why choose DevNov" title={<>A partner for<br />your next big idea.</>} /><div className="flex max-w-[530px] items-end gap-8"><p className="dev-copy">We combine strategic thinking, thoughtful design and reliable development to help turn ideas into useful products.</p><a href="#contact" className="hidden min-w-max items-center gap-2 text-xs font-extrabold text-[#f34b1a] hover:underline sm:inline-flex">Talk with us <ArrowRight className="size-4" /></a></div></div><div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map(({title,description,Icon},i) => <article key={title} className="dev-card min-h-[235px] p-6"><span className={`dev-icon ${i % 2 ? 'dev-icon-dark' : ''}`}><Icon className="size-6" strokeWidth={1.85} /></span><h3 className="mt-5 text-[17px] font-extrabold tracking-[-.035em] text-[#101b27]">{title}</h3><p className="dev-copy mt-3">{description}</p></article>)}</div></div></section>;
}
