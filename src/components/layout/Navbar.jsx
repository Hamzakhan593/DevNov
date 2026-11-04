import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Menu, X, Zap } from 'lucide-react';
import { agency, team as legacyTeam } from '../../data/agencyData.js';
import managedTeam from '../../data/team.json';
import './mobile-navigation.css';

// These anchors are guaranteed by the public application. Team is inserted
// only when a real, approved profile exists.
const activeSections = new Set(['top', 'services', 'work', 'why-devnov', 'process', 'faq', 'contact']);
const isSafeExternalUrl = (value) => typeof value === 'string' && /^https:\/\/[^\s]+$/i.test(value.trim());

function MobileMenuSheet({ links, activeSection, bookingUrl, onNavigate, onClose, triggerRef, reducedMotion }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      if (!window.matchMedia('(min-width: 1024px)').matches) {
        triggerRef.current?.focus({ preventScroll: true });
      }
    };
  }, [triggerRef]);

  return (
    <motion.dialog
      ref={dialogRef}
      id="devnov-mobile-menu"
      aria-labelledby="devnov-mobile-menu-title"
      className="dn-mobile-dialog"
      initial={{ opacity: reducedMotion ? 1 : 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : .2 }}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') { event.preventDefault(); onClose(); }
        if (event.key === 'Tab') {
          const dialog = event.currentTarget;
          const focusable = [...dialog.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')];
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (!first) { event.preventDefault(); dialog.focus(); return; }
          if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
            event.preventDefault(); last.focus();
          } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) {
            event.preventDefault(); first.focus();
          }
        }
      }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <motion.div
        className="dn-mobile-sheet"
        initial={reducedMotion ? false : { y: '100%' }}
        animate={{ y: 0 }}
        exit={reducedMotion ? undefined : { y: '100%' }}
        transition={{ duration: reducedMotion ? 0 : .26, ease: [.22, 1, .36, 1] }}
      >
        <div className="dn-mobile-sheet-handle" aria-hidden="true" />
        <div className="dn-mobile-sheet-heading">
          <div><p className="eyebrow">Explore DevNov</p><h2 id="devnov-mobile-menu-title">Where would you like to go?</h2></div>
          <button ref={closeRef} type="button" onClick={onClose} className="dn-mobile-sheet-close" aria-label="Close navigation"><X size={20} aria-hidden="true" /></button>
        </div>
        <nav className="dn-mobile-sheet-links" aria-label="Mobile navigation">
          {links.map((item) => (
            <a key={item.id} href={item.href} aria-current={activeSection === item.id ? 'location' : undefined} onClick={() => onNavigate(item.id)} className={`dn-mobile-sheet-link ${activeSection === item.id ? 'is-active' : ''}`}>
              <span>{item.label}</span><ArrowRight size={17} aria-hidden="true" />
            </a>
          ))}
        </nav>
        <a href="#contact" onClick={() => onNavigate('contact')} className="dev-primary dn-mobile-sheet-cta">Let's Talk <ArrowRight size={17} aria-hidden="true" /></a>
        {bookingUrl && <a href={bookingUrl} target="_blank" rel="noopener noreferrer" onClick={onClose} className="dn-mobile-book-call">Book a call</a>}
      </motion.div>
    </motion.dialog>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
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
  useEffect(() => {
    const sectionIds = [...activeSections];
    if (hasTeam) sectionIds.splice(sectionIds.indexOf('faq'), 0, 'team');
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const readingLine = window.scrollY + Math.max(160, Math.min(280, window.innerHeight * 0.32));
      let nextActive = 'top';
      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= readingLine) nextActive = id;
      });
      setActiveSection(nextActive);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasTeam]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onBreakpointChange = (event) => { if (event.matches) setMenuOpen(false); };
    desktop.addEventListener('change', onBreakpointChange);
    return () => desktop.removeEventListener('change', onBreakpointChange);
  }, []);
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className={`devnov-header fixed inset-x-0 top-0 z-50 border-b border-[#e1e8ef] bg-white/95 backdrop-blur-xl transition-shadow ${scrolled ? 'is-scrolled shadow-[0_8px_24px_rgba(13,31,46,.10)]' : ''}`}>
        <nav className="dev-container dn15-nav-shell flex h-[82px] items-center justify-between gap-5" aria-label="Main navigation">
          <a href="#top" onClick={closeMenu} aria-label={`${agency.brandName} homepage`} className="inline-flex shrink-0 items-center gap-2 rounded-md">
            <span className="relative grid size-10 place-items-center text-[#ff4b16]"><Zap className="size-9 fill-[#ff4b16] stroke-[#ff4b16]" strokeWidth={2.5} aria-hidden="true" /></span>
            <span className="text-[23px] font-extrabold tracking-[-.075em] text-[#101b27]">{agency.brandName}</span>
          </a>
          <div className="dn15-nav-links hidden items-center justify-center gap-1 lg:flex">{navLinks.map((item) => {
            const isActive = activeSection === item.id;
            return <a key={item.id} href={item.href} aria-current={isActive ? 'page' : undefined} onClick={() => setActiveSection(item.id)} className={`dn15-nav-link rounded-xl px-3 py-3 text-[14px] font-extrabold transition-colors hover:bg-[#fff1eb] hover:text-[#f34b1a] ${isActive ? 'dn15-nav-link-active text-[#f34b1a]' : 'text-[#192635]'}`}>{item.label}</a>;
          })}</div>
          <a className="dev-primary dn15-nav-cta ml-auto shrink-0" href="#contact">Let's Talk <ArrowRight className="size-4" aria-hidden="true" /></a>
        </nav>
      </header>
      <button ref={toggleRef} className="dn-mobile-menu-trigger" type="button" onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-controls="devnov-mobile-menu" aria-haspopup="dialog" aria-label="Open navigation"><Menu size={19} aria-hidden="true" /><span>Menu</span></button>
      <AnimatePresence initial={false}>
        {menuOpen && <MobileMenuSheet links={navLinks} activeSection={activeSection} bookingUrl={bookingUrl} onNavigate={(id) => { setActiveSection(id); closeMenu(); }} onClose={closeMenu} triggerRef={toggleRef} reducedMotion={prefersReducedMotion} />}
      </AnimatePresence>
    </>
  );
}
