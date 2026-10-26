import { ArrowRight, ArrowUpRight, Github, Globe2, Mail, Zap } from 'lucide-react';
import { agency } from '../../data/agencyData.js';
const validHttps = (url) => typeof url === 'string' && /^https:\/\/[a-z0-9.-]+(?:\:[0-9]+)?(?:[/?#][^\s]*)?$/i.test(url.trim());
const validEmail = (email) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
export default function Footer() {
  const email = validEmail(agency.email) ? agency.email.trim() : '';
  const links = (agency.socialLinks || []).filter((link) => validHttps(link.url));
  const navLinks = [
    { href: '#top', label: 'Home' },
    { href: '#why-devnov', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#work', label: 'Work' },
    { href: '#process', label: 'Process' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <footer className="dn20-footer" aria-label="Footer">
      <div className="dev-container dn20-footer-main">
        <div className="dn20-footer-brand">
          <a href="#top" className="inline-flex items-center gap-1.5 text-[22px] font-extrabold tracking-[-.06em] text-white">
            <Zap className="size-8 fill-[#ff4b16] text-[#ff4b16]" aria-hidden="true" />{agency.brandName}
          </a>
          <p>{agency.summary}</p>
        </div>

        <nav aria-label="Footer navigation" className="dn20-footer-nav">
          <p>Explore</p>
          <div>{navLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}</div>
        </nav>

        <div className="dn20-footer-contact">
          <p className="dn20-footer-label">Have a project in mind?</p>
          <a href="#contact" className="dn20-footer-cta">Start a conversation <ArrowUpRight className="size-4" aria-hidden="true" /></a>
          <div className="dn20-footer-socials">
            {links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label || 'External social profile'}>{link.id === 'github' ? <Github className="size-4" /> : <Globe2 className="size-4" />}</a>)}
            {email && <a href={`mailto:${email}`} aria-label="Email DevNov"><Mail className="size-4" /></a>}
          </div>
        </div>
      </div>
      <div className="dn20-footer-bottom"><div className="dev-container"><span>© {new Date().getFullYear()} {agency.brandName}. All rights reserved.</span><span>Thoughtful software. Real impact. <ArrowRight className="ml-1 inline size-3 text-[#ff6a3b]" aria-hidden="true" /></span></div></div>
    </footer>
  );
}
