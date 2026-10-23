import { lazy, Suspense } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Hero from './components/sections/Hero.jsx';
import Services from './components/sections/Services.jsx';
import TechMarquee from './components/sections/TechMarquee.jsx';
import FeaturedWork from './components/sections/FeaturedWork.jsx';
import WhyUs from './components/sections/WhyUs.jsx';
import Process from './components/sections/Process.jsx';
import Team from './components/sections/Team.jsx';
import FAQ from './components/sections/FAQ.jsx';
import Contact from './components/sections/Contact.jsx';
import { PublicContentProvider } from './context/PublicContentContext.jsx';

const AdminPage = lazy(() => import('./components/admin/AdminPage.jsx'));

const isAdminLocation = () => {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.replace(/\/+$/, '') === '/admin';
};

export default function App() {
  if (isAdminLocation()) {
    return <Suspense fallback={<main className="min-h-screen bg-[#f4f7fb]" aria-busy="true" />}><AdminPage onExit={() => { window.location.assign('/'); }} /></Suspense>;
  }

  return (
    <PublicContentProvider>
      <div id="top" className="min-h-screen overflow-x-clip bg-page font-sans text-body">
        <Navbar />
        <main id="main-content"><Hero /><Services /><TechMarquee /><FeaturedWork /><WhyUs /><Process /><Team /><FAQ /><Contact /></main>
        <Footer />
      </div>
    </PublicContentProvider>
  );
}
