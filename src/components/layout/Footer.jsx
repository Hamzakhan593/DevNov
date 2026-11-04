import { ArrowUp, ArrowUpRight, Github, Globe2, Mail, Zap } from 'lucide-react';
import { agency } from '../../data/agencyData.js';
import './footer.css';
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
    <footer className="dn20-footer dn-footer" aria-label="Footer">
      <div className="dev-container dn-footer-main">
        <div className="dn-footer-brand">
          <a href="#top" className="dn-footer-logo" aria-label={`${agency.brandName} homepage`}>
            <Zap size={31} fill="currentColor" aria-hidden="true" /><span>{agency.brandName}</span>
          </a>
          <p>{agency.summary}</p>
          {links.length > 0 && <div className="dn-footer-socials">
            {links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label || 'External social profile'}>{link.id === 'github' ? <Github size={18} aria-hidden="true" /> : <Globe2 size={18} aria-hidden="true" />}</a>)}
          </div>}
        </div>

        <nav aria-label="Footer navigation" className="dn-footer-nav">
          <p className="dn-footer-label">Explore</p>
          <div>{navLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}</div>
        </nav>

        <div className="dn-footer-contact">
          <p className="dn-footer-label">Have a project in mind?</p>
          <a href="#contact" className="dn-footer-cta"><span>Start a conversation</span><ArrowUpRight size={22} aria-hidden="true" /></a>
          {email && <a href={`mailto:${email}`} className="dn-footer-email"><Mail size={16} aria-hidden="true" /><span>{email}</span></a>}
        </div>
      </div>
      <div className="dn-footer-bottom"><div className="dev-container"><span>© {new Date().getFullYear()} {agency.brandName}. All rights reserved.</span><a href="#top">Back to top <ArrowUp size={15} aria-hidden="true" /></a></div></div>
    </footer>
  );
}
