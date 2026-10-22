import { existsSync, readFileSync } from 'node:fs';
import { agency, contact, projects, team, testimonials } from '../src/data/agencyData.js';
import managedProjects from '../src/data/projects.json' with { type: 'json' };
import managedTeam from '../src/data/team.json' with { type: 'json' };

let failures = 0;
const pass = (message) => console.log('PASS:', message);
const fail = (message) => { failures++; console.error('FAIL:', message); };
const pending = (message) => console.log('PENDING:', message);
const required = ['src/components/sections/Services.jsx','src/components/sections/Process.jsx','src/components/sections/WhyUs.jsx','src/components/sections/FAQ.jsx','src/components/sections/Contact.jsx','src/components/sections/FeaturedWork.jsx','src/components/sections/Team.jsx','src/data/projects.json','src/data/team.json','public/favicon.svg','public/robots.txt','scripts/verify-module3.mjs','DEPLOYMENT-GUIDE.md','CONTACT-GUIDE.md','TEAM-GUIDE.md'];
for (const file of required) existsSync(file) ? pass(file) : fail('Missing ' + file);
const app = readFileSync('src/App.jsx','utf8');
for (const section of ['Hero','FeaturedWork','TechMarquee','Services','Process','WhyUs','FAQ','Team','Contact']) app.includes(`<${section} />`) ? pass(`${section} mounted`) : fail(`${section} not mounted in App.jsx`);
const navbar = readFileSync('src/components/layout/Navbar.jsx','utf8');
for (const section of ['work','services','process','contact']) navbar.includes(`'${section}'`) ? pass(`Navbar ${section} link`) : fail(`Navbar ${section} link missing`);
if (!managedProjects.length && !projects.length) pending('No genuine project records. Add with npm.cmd run projects:add.');
else pass(`${[...managedProjects,...projects].filter((p)=>p.published !== false).length} published project records (not independently verified)`);
if (!managedTeam.length && !team.length) pending('No team profiles. Add approved profiles with npm.cmd run team:add.');
for (const p of managedTeam) { if (p.published && !p.permissionGranted) fail(`Team consent missing: ${p.id}`); else pass(`Team consent state: ${p.id}`); }
if (testimonials.some((t) => !t.permissionGranted)) fail('Unapproved testimonials present.');
if (!agency.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agency.email)) pending('Verified public email missing.');
if (!agency.calendlyUrl) pending('No booking URL (optional).');
if (!contact.accessKey && !process.env.VITE_WEB3FORMS_ACCESS_KEY) pending('Web3Forms access key not in JS data or current environment. Configure in .env.local or hosting environment if using form.');
const robots = existsSync('public/robots.txt') ? readFileSync('public/robots.txt','utf8') : '';
robots.includes('Disallow: /') ? pending('SEO draft mode active — noindex until a real domain is configured.') : pass('SEO production robots file');
if (existsSync('dist/index.html')) pass('Production HTML exists (rebuild after latest changes)'); else pending('dist/index.html missing. Run npm.cmd run build.');
if (failures) process.exit(1);
console.log('PASS: Structural release audit complete. PENDING items still need owner action.');