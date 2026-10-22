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
export default function App() {
  return <div id="top" className="min-h-screen overflow-x-clip bg-page font-sans text-body"><Navbar /><main id="main-content"><Hero /><Services /><TechMarquee /><FeaturedWork /><WhyUs /><Process /><Team /><FAQ /><Contact /></main><Footer /></div>;
}
