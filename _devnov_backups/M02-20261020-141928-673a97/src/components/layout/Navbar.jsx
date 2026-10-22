import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { agency, team as legacyTeam } from '../../data/agencyData.js';
import managedTeam from '../../data/team.json';

const activeSections = new Set(['work', 'services', 'process', 'contact']);
const isSafeExternalUrl = (value) => typeof value === 'string' && /^https:\/\/[^\s]+$/i.test(value.trim());

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const toggleRef = useRef(null);
  const validEmail = typeof agency.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agency.email.trim());
  const bookingUrl = isSafeExternalUrl(agency.calendlyUrl) ? agency.calendlyUrl.trim() : '';
  const contactHref = bookingUrl || (validEmail ? `mailto:${agency.email.trim()}` : '#contact');
  const contactLabel = bookingUrl || validEmail ? 'Start a project' : 'Contact';
  const hasTeam = [...managedTeam, ...legacyTeam].some((p) => p.published !== false && p.name && p.role);
  const navLinks = [...(agency.navigation || []).filter((item) => activeSections.has(item.id) && item.id !== 'contact'), ...(hasTeam ? [{id:'team',label:'Team',href:'#team'}] : []), {id:'faq',label:'FAQ',href:'#faq'}, {id:'contact',label:'Contact',href:'#contact'}];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const linkClass = 'rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.055] hover:text-white focus-visible:outline-2 focus-visible:outline-indigo-300';

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || menuOpen ? 'border-b border-white/10 bg-[#090D16]/95 shadow-[0_12px_45px_rgba(0,0,0,.22)] backdrop-blur-xl' : 'border-b border-white/[0.06] bg-[#090D16]/75 backdrop-blur-md'}`}>
        <nav className="mx-auto flex h-[76px] w-full max-w-[1240px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10" aria-label="Main navigation">
          <a href="#top" onClick={closeMenu} className="group flex shrink-0 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-indigo-300" aria-label={`${agency.brandName} homepage`}>
            <span aria-hidden="true" className="brand-glyph relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-[12px] border border-indigo-300/30 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-800 shadow-[0_7px_25px_rgba(99,102,241,.24)]">
              <span className="relative font-semibold text-[22px] tracking-[-0.15em] text-white" style={{ transform: 'translateX(-2px)' }}>D<span className="text-indigo-200">.</span></span>
            </span>
            <span className="text-[20px] font-bold tracking-[-0.065em] text-white">{agency.brandName}<span className="text-indigo-400">.</span></span>
          </a>

          <div className="hidden items-center gap-2 xl:flex">
            <a className={linkClass} href="#top">Home</a>
            {navLinks.map((item) => <a className={linkClass} key={item.id} href={item.href}>{item.label}</a>)}
          </div>

          <div className="hidden items-center gap-4 xl:flex">
            <span className="hidden items-center gap-2 text-xs text-slate-400 lg:inline-flex"><span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />Product engineering studio</span>
            <a className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 text-sm font-semibold text-white shadow-[0_9px_30px_rgba(99,102,241,.23)] transition hover:-translate-y-0.5 hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300" href={contactHref} {...(bookingUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              {contactLabel}<ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>

          <button ref={toggleRef} className="inline-flex size-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.045] text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-indigo-300 xl:hidden" type="button" onClick={() => setMenuOpen((current) => !current)} aria-expanded={menuOpen} aria-controls="devnov-mobile-menu" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>

        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.div id="devnov-mobile-menu" initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.2 }} className="overflow-hidden border-t border-white/10 bg-[#0c1220] xl:hidden">
              <div className="mx-auto flex max-w-[1240px] flex-col gap-1 px-5 py-5 sm:px-8">
                <a href="#top" onClick={closeMenu} className="mobile-nav-link">Home</a>
                {navLinks.map((item) => <a key={item.id} href={item.href} onClick={closeMenu} className="mobile-nav-link">{item.label}</a>)}
                <a href={contactHref} onClick={closeMenu} className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white" {...(bookingUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{contactLabel}<ArrowUpRight className="size-4" aria-hidden="true" /></a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}