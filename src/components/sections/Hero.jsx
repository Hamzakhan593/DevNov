import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, Bot, Globe2, Laptop, MessageSquare, Play,
  Rocket, Smartphone, Sparkles, PencilRuler,
} from 'lucide-react';
import { agency } from '../../data/agencyData.js';

const reveal = (reduced, delay = 0) => ({
  initial: reduced ? false : { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduced ? 0 : 0.55, delay: reduced ? 0 : delay },
});

const highlights = [
  { Icon: Laptop, title: 'Web, Mobile & AI Solutions', description: 'From idea to launch' },
  { Icon: PencilRuler, title: 'Clean UI/UX & Development', description: 'Beautiful and functional' },
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
    <div className="dn15-hero-art" aria-label="Illustrative black-and-white portrait beside DevNov capability cards">
      <div className="dn15-orange-stroke" aria-hidden="true" />
      <div className="dn15-orange-shape" aria-hidden="true" />
      <img
        src="/devnov-hero-portrait.webp"
        alt="Illustrative monochrome portrait used as a visual design element, not a DevNov team member"
        className="dn15-portrait"
        width="775"
        height="705"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
      <div className="dn15-handnote" aria-hidden="true">
        Better Software<br />Brighter Tomorrows
        <svg viewBox="0 0 64 36" focusable="false" aria-hidden="true" className="dn15-sketcharrow">
          <path d="M2 4 Q23 27 56 23 M46 15 L58 23 L48 33" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="dn15-highlights">
        {highlights.map(({ Icon, title, description }) => (
          <div className="dn15-highlight" key={title}>
            <div className="dn15-highlight-icon"><Icon size={25} strokeWidth={2.2} aria-hidden="true" /></div>
            <div className="dn15-highlight-text">
              <strong>{title}</strong>
              <span>{description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const reduced = useReducedMotion();
  return (
    <section className="dn15-hero" aria-labelledby="hero-heading">
      <div className="dev-container dn15-hero-main">
        <div className="dn15-hero-copy">
          <motion.p {...reveal(reduced, 0.03)} className="eyebrow">Ideas. Products. Real impact.</motion.p>
          <motion.h1
            {...reveal(reduced, 0.10)}
            id="hero-heading"
            className="dn15-title"
          >
            We build digital products that <span>move the world.</span>
          </motion.h1>
          <motion.p {...reveal(reduced, 0.18)} className="dn15-description">
            {agency.brandName} helps ambitious teams design, build and scale powerful digital experiences — from first idea to final launch.
          </motion.p>
          <motion.div {...reveal(reduced, 0.25)} className="dn15-cta-row">
            <a href="#contact" className="dev-primary dn15-main-cta">Start a Project <ArrowRight className="size-5" aria-hidden="true" /></a>
            <a href="#work" className="dev-secondary dn15-second-cta">
              <span className="dn15-play-icon"><Play className="size-3 fill-white" aria-hidden="true" /></span>
              See Our Work
            </a>
          </motion.div>
        </div>
        <motion.div {...reveal(reduced, 0.17)} className="dn15-art-wrap"><HeroArtwork /></motion.div>
      </div>
      <div className="dev-container dn15-capabilities">
        {capabilities.map(({ title, Icon }) => (
          <a href="#services" key={title} className="dn15-capability">
            <span className="dn15-capability-icon"><Icon size={22} strokeWidth={2.2} aria-hidden="true" /></span>
            <span>{title}</span><ArrowRight className="dn15-chip-arrow" size={16} aria-hidden="true" />
          </a>
        ))}
      </div>
      <p className="sr-only">Illustrative interface styling and generated portrait are visual placeholders, not genuine DevNov team or client photography.</p>
    </section>
  );
}
