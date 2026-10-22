import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Bot, Check, CloudCog, Code2, Globe2, Laptop, MessageSquare, Play, Rocket, Smartphone, Sparkles, Workflow } from 'lucide-react';
import { agency } from '../../data/agencyData.js';

const reveal = (reduced, delay = 0) => ({ initial: reduced ? false : { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : .55, delay: reduced ? 0 : delay } });
const features = [
  { Icon: Laptop, title: 'Web, Mobile & AI Solutions', description: 'From idea to launch' },
  { Icon: Sparkles, title: 'Clean UI/UX & Development', description: 'Beautiful and functional' },
  { Icon: MessageSquare, title: 'Clear Communication', description: 'Direct, clear and reliable' },
  { Icon: Rocket, title: 'Startup-Friendly Process', description: 'Built around your idea' },
];
const capabilities = [
  { title: 'Custom Software', Icon: Laptop },
  { title: 'Modern Websites', Icon: Globe2 },
  { title: 'Mobile Apps', Icon: Smartphone },
  { title: 'AI Automation', Icon: Bot },
];

function HeroArtwork() {
  return (
    <div className="devnov-hero-art relative isolate w-full min-w-0" aria-label="Illustrative DevNov digital-product interface">
      <div aria-hidden="true" className="devnov-hero-orange-shape" />
      <div className="devnov-hero-art-grid">
        <div className="devnov-product-window min-w-0 overflow-hidden">
          <div className="flex h-10 items-center justify-between gap-2 border-b border-white/10 bg-[#1b2e3e] px-3 sm:px-4">
            <div className="flex shrink-0 gap-1.5" aria-hidden="true"><i className="size-2.5 rounded-full bg-[#ff6745]" /><i className="size-2.5 rounded-full bg-[#ffbf57]" /><i className="size-2.5 rounded-full bg-[#78cb9f]" /></div>
            <span className="truncate text-[10px] font-extrabold tracking-wide text-slate-300">DevNov / DIGITAL PRODUCTS</span>
            <Code2 className="size-4 shrink-0 text-[#ff754b]" aria-hidden="true" />
          </div>
          <div className="flex min-h-[292px] flex-col justify-center bg-[#101e2b] p-5 sm:p-6 lg:min-h-[320px] lg:p-5 xl:p-7">
            <span className="mb-5 grid size-12 place-items-center rounded-2xl bg-[#ff4b16] shadow-[0_10px_26px_rgba(255,75,22,.24)]"><Workflow className="size-6 text-white" aria-hidden="true" /></span>
            <p className="text-[11px] font-extrabold uppercase tracking-[.18em] text-[#ff895f]">Built from ideas</p>
            <h3 className="mt-2 text-[clamp(1.35rem,2.5vw,2.05rem)] font-extrabold leading-tight tracking-[-.045em] text-white">Digital, done right.</h3>
            <p className="mt-3 max-w-[300px] text-[12px] leading-5 text-slate-300">Thoughtful design and scalable engineering, working together.</p>
            <div className="mt-6 grid grid-cols-3 gap-2">
              <div className="devnov-mini-tile"><Globe2 className="size-5 text-[#ff754b]" /><span>Web</span></div>
              <div className="devnov-mini-tile"><Smartphone className="size-5 text-[#ff754b]" /><span>Mobile</span></div>
              <div className="devnov-mini-tile"><Bot className="size-5 text-[#ff754b]" /><span>AI</span></div>
            </div>
          </div>
        </div>
        <div className="devnov-hero-feature-list">
          {features.map(({ Icon, title, description }) => (
            <div className="dev-card devnov-hero-feature flex min-w-0 items-center gap-3 p-3" key={title}>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#ffede6] text-[#ff4b16]"><Icon className="size-5" aria-hidden="true" /></span>
              <span className="min-w-0"><span className="block text-[12px] font-extrabold leading-[1.25] text-[#101b27]">{title}</span><span className="mt-1 block text-[10px] leading-[1.3] text-[#586c7d]">{description}</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const reduced = useReducedMotion();
  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_56%_10%,#fff_20%,#f5f9fc_100%)] pt-[115px] pb-8 sm:pt-[132px]" aria-labelledby="hero-heading">
      <div className="dev-container grid items-center gap-10 lg:grid-cols-[1.02fr_.98fr] lg:gap-8">
        <div className="relative z-10 pt-5 lg:pt-0">
          <motion.p {...reveal(reduced,.03)} className="eyebrow">Ideas. Products. Real impact.</motion.p>
          <motion.h1 {...reveal(reduced,.1)} id="hero-heading" className="mt-3 max-w-[600px] text-[clamp(2.9rem,5.4vw,5.35rem)] leading-[1.035] font-extrabold tracking-[-.065em] text-[#101b27]">We build digital products that <span className="text-[#ff4b16]">move the world.</span></motion.h1>
          <motion.p {...reveal(reduced,.18)} className="mt-5 max-w-[480px] text-[15px] leading-[1.7] text-[#5b7186] sm:text-[17px]">{agency.brandName} helps ambitious teams design, build and scale powerful digital experiences — from first idea to final launch.</motion.p>
          <motion.div {...reveal(reduced,.25)} className="mt-7 flex flex-wrap gap-3"><a href="#contact" className="dev-primary">Start a Project <ArrowRight className="size-4" /></a><a href="#work" className="dev-secondary"><span className="grid size-6 place-items-center rounded-full bg-[#111d28] text-white"><Play className="size-3 fill-white" /></span>See Our Work</a></motion.div>
        </div>
        <motion.div {...reveal(reduced,.17)} className="relative z-0 min-w-0"><HeroArtwork /></motion.div>
      </div>
      <div className="dev-container relative z-20 mt-5 grid gap-3 sm:grid-cols-2 lg:mt-2 lg:grid-cols-4">{capabilities.map(({title,Icon}) => <a href="#services" key={title} className="dev-card flex min-h-[64px] items-center gap-3 px-5 py-3 text-xs font-extrabold text-[#15232d] sm:text-sm"><Icon className="size-5 shrink-0 text-[#101b27]" strokeWidth={2.1} aria-hidden="true" />{title}</a>)}</div>
      <p className="sr-only">Illustrative interface — not a client project. Add an approved monochrome hero portrait asset if matching the visual reference exactly.</p>
    </section>
  );
}
