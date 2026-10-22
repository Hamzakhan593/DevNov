import { readFileSync, existsSync } from 'node:fs';
import { agency, services, processSteps } from '../src/data/agencyData.js';

let failed = false;
const expect = (condition, label) => {
  if (condition) console.log(`PASS: ${label}`);
  else { failed = true; console.error(`FAIL: ${label}`); }
};
const source = (path) => existsSync(path) ? readFileSync(path, 'utf8') : '';
const nav = source('src/components/layout/Navbar.jsx');
const hero = source('src/components/sections/Hero.jsx');
const app = source('src/App.jsx');
const css = source('src/index.css');

expect(agency.brandName === 'DevNov', 'DevNov branding');
expect(nav.includes('aria-expanded={menuOpen}') && nav.includes('aria-controls="devnov-mobile-menu"'), 'Accessible mobile navigation');
expect(nav.includes("event.key === 'Escape'") && nav.includes('closeMenu'), 'Mobile menu closes on Escape and navigation');
expect(nav.includes('activeSections') && nav.includes("'services'") && nav.includes("'process'"), 'Navbar only links to implemented sections');
expect(hero.includes('id="hero-heading"') && hero.includes('Illustrative interface'), 'Semantic hero and honest product illustration');
expect(hero.includes('useReducedMotion') && nav.includes('useReducedMotion'), 'Reduced motion respected');
const servicesSource = source('src/components/sections/Services.jsx');
const processSource = source('src/components/sections/Process.jsx');
const servicesAnchor = app.includes('id="services"') || (app.includes('<Services />') && servicesSource.includes('id="services"'));
const processAnchor = app.includes('id="process"') || (app.includes('<Process />') && processSource.includes('id="process"'));
expect(app.includes('id="main-content"') && servicesAnchor && processAnchor, 'Functional navigation anchors');
expect(app.includes('import Hero from'), 'Hero mounted in React app');
expect(css.includes('#090D16') && css.includes('#6366F1'), 'Design tokens retained');
expect(Array.isArray(services) && services.length >= 3 && Array.isArray(processSteps) && processSteps.length >= 1, 'Static data previews available');
expect(!app.includes('500+ Cups') && !hero.includes('100+ Clients'), 'No fabricated marketing claims');
if (failed) process.exit(1);
console.log('PASS: Module 2 source validation completed.');