import { ArrowRight, ArrowUpRight, Code2, Layers, Workflow } from 'lucide-react';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Hero from './components/sections/Hero.jsx';
import FeaturedWork from './components/sections/FeaturedWork.jsx';
import Services from './components/sections/Services.jsx';
import Process from './components/sections/Process.jsx';
import WhyUs from './components/sections/WhyUs.jsx';
import Team from './components/sections/Team.jsx';
import FAQ from './components/sections/FAQ.jsx';
import Contact from './components/sections/Contact.jsx';
import TechMarquee from './components/sections/TechMarquee.jsx';
import { agency, processSteps, services } from './data/agencyData.js';

const capabilityIcons = { 'web-apps': Code2, 'business-software': Layers, 'ai-automation': Workflow };
const capabilityIds = ['web-apps', 'business-software', 'ai-automation'];

export default function App() {
  const capabilities = capabilityIds.map((id) => services.find((service) => service.id === id)).filter(Boolean);
  const validEmail = typeof agency.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agency.email.trim());
  const bookingUrl = typeof agency.calendlyUrl === 'string' && /^https:\/\/[^\s]+$/i.test(agency.calendlyUrl.trim()) ? agency.calendlyUrl.trim() : '';
  const contactHref = bookingUrl || (validEmail ? `mailto:${agency.email.trim()}` : '');

  return (
    <div id="top" className="min-h-screen overflow-x-clip bg-page font-sans text-body">
      <Navbar />
      <main id="main-content">
        <Hero />
        <TechMarquee />
        <FeaturedWork />
        <Services />
        <Process />
        <WhyUs />
        <Team />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}