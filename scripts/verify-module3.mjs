import { existsSync, readFileSync } from 'node:fs';
import { projects as legacyProjects } from '../src/data/agencyData.js';
import managedProjects from '../src/data/projects.json' with { type: 'json' };

let invalid = false;
const check = (condition, label) => {
  if (condition) console.log(`PASS: ${label}`);
  else { console.error(`FAIL: ${label}`); invalid = true; }
};
const file = (name) => existsSync(name) ? readFileSync(name, 'utf8') : '';
const app = file('src/App.jsx');
const navbar = file('src/components/layout/Navbar.jsx');
const featured = file('src/components/sections/FeaturedWork.jsx');
const card = file('src/components/ui/ProjectCard.jsx');
const dialog = file('src/components/ui/CaseStudyDialog.jsx');
const managed = file('scripts/manage-projects.mjs');

check(app.includes('import FeaturedWork from') && app.includes('<FeaturedWork />'), 'Featured work mounted between hero and services');
check(navbar.includes("'work'") && navbar.includes('activeSections'), 'Work navigation points to real section');
check(featured.includes('id="work"') && featured.includes('allProjects') && featured.includes('managedProjects'), 'Real managed and legacy content displayed');
check(featured.includes('activeCategory') && featured.includes('setShowAll'), 'Category filters and Show all work');
check(featured.includes('selectedProject') && dialog.includes('role="dialog"') && dialog.includes('aria-modal="true"'), 'Accessible case-study details');
check(dialog.includes("event.key === 'Escape'") && dialog.includes("event.key === 'Tab'") && dialog.includes('previousFocus.current'), 'Dialog Escape, focus trap and focus restore');
check(card.includes('safeImage(project.image)') && card.includes('safeLink(project.liveUrl)'), 'Valid image and public links only');
check(managed.includes('COPYFILE_EXCL') && managed.includes('renameSync') && managed.includes('published'), 'Project manager protects images and updates store');
check(Array.isArray(managedProjects) && Array.isArray(legacyProjects), 'Both static data sources valid arrays');
const ids = new Set();
for (const p of [...managedProjects, ...legacyProjects]) {
  const slug = String(p.slug || p.id || '');
  check(Boolean(slug && p.title && p.summary && /^[a-z0-9-]+$/.test(slug)), `Required project data: ${slug || '(blank)'}`);
  check(!ids.has(slug), `Unique project slug: ${slug}`);
  ids.add(slug);
  check(p.technologies === undefined || Array.isArray(p.technologies), `Technology list: ${slug}`);
  for (const field of ['liveUrl', 'repositoryUrl']) check(!p[field] || /^https:\/\/[^\s]+$/i.test(p[field]), `Secure ${field}: ${slug}`);
  if (p.image) {
    check(/^\/projects\/[a-zA-Z0-9._-]+\.(png|jpg|jpeg|webp|avif)$/i.test(p.image), `Safe image path: ${slug}`);
    check(existsSync('public' + p.image), `Screenshot exists: ${slug}`);
  }
}
check(!featured.includes('500+ clients') && !featured.includes('fake testimonials'), 'No fabricated marketing claims');
if (!managedProjects.length && !legacyProjects.length) console.log('PENDING: No genuine projects published; add via npm.cmd run projects:add');
if (invalid) process.exit(1);
console.log('PASS: Module 03 source and content validation completed.');