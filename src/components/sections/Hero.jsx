import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, BadgeCheck, Bot, Globe2, Laptop, MessageSquare, Play,
  Rocket, Smartphone, Sparkles, PencilRuler,
} from 'lucide-react';
import { agency } from '../../data/agencyData.js';

const reveal = (reduced, delay = 0) => ({
  initial: reduced ? false : { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduced ? 0 : 0.55, delay: reduced ? 0 : delay },
});

const highlights = [
  { Icon: Laptop, title: 'Web, mobile & AI', description: 'One connected product team' },
  { Icon: PencilRuler, title: 'Product design', description: 'Clear flows before code' },
  { Icon: MessageSquare, title: 'Working together', description: 'Direct, useful communication' },
  { Icon: Rocket, title: 'Flexible delivery', description: 'A practical path to launch' },
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
      <div className="dn21-hero-proof" aria-hidden="true">
        <span className="dn21-hero-proof-icon"><Sparkles size={16} strokeWidth={2.3} /></span>
        <span>
          <strong>Start with clarity</strong>
          <small>Goals, users and a useful next step</small>
        </span>
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
          <motion.p {...reveal(reduced, 0.03)} className="eyebrow">Strategy, design &amp; engineering</motion.p>
          <motion.h1
            {...reveal(reduced, 0.10)}
            id="hero-heading"
            className="dn15-title"
          >
            Digital products built to <span>move your business forward.</span>
          </motion.h1>
          <motion.p {...reveal(reduced, 0.18)} className="dn15-description">
            {agency.brandName} partners with founders and growing teams to turn complex ideas into clear, useful web, mobile and AI products—from early strategy through launch.
          </motion.p>
          <motion.div {...reveal(reduced, 0.21)} className="dn21-hero-signals" aria-label="How DevNov approaches product work">
            <span><BadgeCheck className="size-4" aria-hidden="true" /> Clear scope before build</span>
            <span><BadgeCheck className="size-4" aria-hidden="true" /> Designed around real users</span>
          </motion.div>
          <motion.div {...reveal(reduced, 0.25)} className="dn15-cta-row">
            <a href="#contact" className="dev-primary dn15-main-cta">Discuss your project <ArrowRight className="size-5" aria-hidden="true" /></a>
            <a href="#work" className="dev-secondary dn15-second-cta">
              <span className="dn15-play-icon"><Play className="size-3 fill-white" aria-hidden="true" /></span>
              Explore our work
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
