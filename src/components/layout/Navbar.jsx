import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Menu, X, Zap } from 'lucide-react';
import { agency, team as legacyTeam } from '../../data/agencyData.js';
import managedTeam from '../../data/team.json';

const activeSections = new Set(['work', 'services', 'process', 'contact']);
const isSafeExternalUrl = (value) => typeof value === 'string' && /^https:\/\/[^\s]+$/i.test(value.trim());

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const toggleRef = useRef(null);
  const hasTeam = [...managedTeam, ...legacyTeam].some((p) => p.published !== false && p.name && p.role);
  const bookingUrl = isSafeExternalUrl(agency.calendlyUrl) ? agency.calendlyUrl.trim() : '';
  const navLinks = [
    { id: 'top', label: 'Home', href: '#top' },
    { id: 'services', label: 'Services', href: '#services' },
    { id: 'work', label: 'Work', href: '#work' },
    { id: 'why-devnov', label: 'About', href: '#why-devnov' },
    { id: 'process', label: 'Process', href: '#process' },
    ...(hasTeam ? [{ id: 'team', label: 'Team', href: '#team' }] : []),
    { id: 'faq', label: 'FAQ', href: '#faq' },
  ];
  const closeMenu = () => setMenuOpen(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 12); window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); return () => window.removeEventListener('scroll', onScroll); }, []);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => { if (event.key === 'Escape') { setMenuOpen(false); toggleRef.current?.focus(); } };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className={`devnov-header fixed inset-x-0 top-0 z-50 border-b border-[#e1e8ef] bg-white/95 backdrop-blur-xl transition-shadow ${scrolled ? 'shadow-[0_8px_24px_rgba(13,31,46,.10)]' : ''}`}>
        <nav className="dev-container dn15-nav-shell flex h-[82px] items-center justify-between gap-5" aria-label="Main navigation">
          <a href="#top" onClick={closeMenu} aria-label={`${agency.brandName} homepage`} className="inline-flex shrink-0 items-center gap-2 rounded-md">
            <span className="relative grid size-10 place-items-center text-[#ff4b16]"><Zap className="size-9 fill-[#ff4b16] stroke-[#ff4b16]" strokeWidth={2.5} aria-hidden="true" /></span>
            <span className="text-[23px] font-extrabold tracking-[-.075em] text-[#101b27]">{agency.brandName}</span>
          </a>
          <div className="dn15-nav-links hidden items-center justify-center gap-1 lg:flex">{navLinks.map((item) => <a key={item.id} href={item.href} className={`dn15-nav-link rounded-xl px-3 py-3 text-[14px] font-extrabold transition-colors hover:bg-[#fff1eb] hover:text-[#f34b1a] ${item.id === 'top' ? 'dn15-nav-link-active text-[#f34b1a]' : 'text-[#192635]'}`}>{item.label}</a>)}</div>
          <a className="dev-primary dn15-nav-cta ml-auto hidden shrink-0 lg:inline-flex" href="#contact">Let's Talk <ArrowRight className="size-4" aria-hidden="true" /></a>
          <button ref={toggleRef} className="grid size-11 place-items-center rounded-xl border border-[#ced9e3] bg-[#f5f8fb] text-[#101b27] lg:hidden" type="button" onClick={() => setMenuOpen((current) => !current)} aria-expanded={menuOpen} aria-controls="devnov-mobile-menu" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
        </nav>
        <AnimatePresence initial={false}>{menuOpen && <motion.div id="devnov-mobile-menu" initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }} transition={{ duration: prefersReducedMotion ? 0 : .2 }} className="overflow-hidden border-t border-[#e4eaf0] bg-white shadow-xl lg:hidden"><div className="dev-container flex flex-col gap-1 py-4">{navLinks.map((item) => <a key={item.id} href={item.href} onClick={closeMenu} className="mobile-nav-link">{item.label}</a>)}<a href="#contact" onClick={closeMenu} className="dev-primary mt-2">Let's Talk <ArrowRight className="size-4" /></a>{bookingUrl && <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="p-3 text-center text-xs font-semibold text-[#f34b1a]">Book a call</a>}</div></motion.div>}</AnimatePresence>
      </header>
    </>
  );
}
