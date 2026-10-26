import { lazy, Suspense } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Hero from './components/sections/Hero.jsx';
import Services from './components/sections/Services.jsx';
import TechMarquee from './components/sections/TechMarquee.jsx';
import FeaturedWork from './components/sections/FeaturedWork.jsx';
import { PublicContentProvider } from './context/PublicContentContext.jsx';

const AdminPage = lazy(() => import('./components/admin/AdminPage.jsx'));
const WhyUs = lazy(() => import('./components/sections/WhyUs.jsx'));
const Process = lazy(() => import('./components/sections/Process.jsx'));
const Team = lazy(() => import('./components/sections/Team.jsx'));
const FAQ = lazy(() => import('./components/sections/FAQ.jsx'));
const Contact = lazy(() => import('./components/sections/Contact.jsx'));

const isAdminLocation = () => {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.replace(/\/+$/, '') === '/admin';
};

function DeferredSectionPlaceholder({ id, label }) {
  return (
    <section id={id} className="dn21-section-placeholder dev-section" aria-busy="true" aria-label={`Loading ${label}`}>
      <div className="dev-container"><span className="dn21-section-placeholder-line" /><span className="dn21-section-placeholder-line dn21-section-placeholder-line-short" /></div>
    </section>
  );
}

export default function App() {
  if (isAdminLocation()) {
    return <Suspense fallback={<main className="min-h-screen bg-[#f4f7fb]" aria-busy="true" />}><AdminPage onExit={() => { window.location.assign('/'); }} /></Suspense>;
  }

  return (
    <PublicContentProvider>
      <div id="top" className="min-h-screen overflow-x-clip bg-page font-sans text-body">
        <Navbar />
        <main id="main-content">
          <Hero />
          <Services />
          <TechMarquee />
          <FeaturedWork />
          <Suspense fallback={<DeferredSectionPlaceholder id="why-devnov" label="about section" />}><WhyUs /></Suspense>
          <Suspense fallback={<DeferredSectionPlaceholder id="process" label="process section" />}><Process /></Suspense>
          <Suspense fallback={null}><Team /></Suspense>
          <Suspense fallback={<DeferredSectionPlaceholder id="faq" label="FAQ section" />}><FAQ /></Suspense>
          <Suspense fallback={<DeferredSectionPlaceholder id="contact" label="contact section" />}><Contact /></Suspense>
        </main>
        <Footer />
      </div>
    </PublicContentProvider>
  );
}
