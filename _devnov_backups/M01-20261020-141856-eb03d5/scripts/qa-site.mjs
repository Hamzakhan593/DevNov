/** Static-site content checks. No internet request, no claim of WCAG compliance. */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { agency, projects as legacyProjects, team as legacyTeam, testimonials } from '../src/data/agencyData.js';
import managedProjects from '../src/data/projects.json' with { type: 'json' };
import managedTeam from '../src/data/team.json' with { type: 'json' };

let failures = 0;
let warnings = 0;
const pass = (label) => console.log('PASS:', label);
const fail = (label) => { console.error('FAIL:', label); failures++; };
const warn = (label) => { console.log('PENDING:', label); warnings++; };
const text = (file) => readFileSync(file, 'utf8');
const publicAsset = (webPath) => {
  if (typeof webPath !== 'string' || !webPath.startsWith('/') || webPath.startsWith('//') || webPath.includes('..') || webPath.includes('\\') || webPath.includes('?')) return false;
  return existsSync(resolve('public', `.${webPath}`));
};
const urlIsSafe = (value) => {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password && !/\s/.test(value); }
  catch { return false; }
};
const jsx = [];
function collect(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const filepath = `${dir}/${entry.name}`;
    if (entry.isDirectory()) collect(filepath);
    else if (entry.name.endsWith('.jsx')) jsx.push({ path: filepath, contents: text(filepath) });
  }
}
collect('src');
const ids = new Set();
const links = [];
for (const file of jsx) {
  for (const match of file.contents.matchAll(/\bid="([\w-]+)"/g)) ids.add(match[1]);
  for (const match of file.contents.matchAll(/\bhref="#([\w-]+)"/g)) links.push({ target: match[1], file: file.path });
}
for (const link of links) ids.has(link.target) ? pass(`Anchor #${link.target}`) : fail(`Broken anchor #${link.target} in ${link.file}`);
if (!links.length) fail('No static navigation anchors could be validated.');
const allProjects = [...managedProjects, ...legacyProjects].filter((p) => p.published !== false);
const allTeam = [...managedTeam, ...legacyTeam].filter((p) => p.published !== false);
if (!allProjects.length) warn('No verified portfolio projects published.');
const slugs = new Set();
for (const item of allProjects) {
  const tag = item.slug || item.id || '(unknown project)';
  if (slugs.has(tag)) fail(`Duplicate published project slug: ${tag}`);
  slugs.add(tag);
  if (!item.title?.trim() || !item.summary?.trim()) fail(`Missing project title/summary: ${tag}`);
  if (item.image && !publicAsset(item.image)) fail(`Project screenshot missing from public/: ${tag} -> ${item.image}`);
  if (item.image && !item.imageAlt?.trim()) warn(`Project screenshot alt text should be reviewed: ${tag}`);
  for (const field of ['liveUrl', 'repositoryUrl']) if (item[field] && !urlIsSafe(item[field])) fail(`Invalid ${field}: ${tag}`);
}
for (const person of allTeam) {
  const tag = person.id || person.name || '(unknown team member)';
  if (person.permissionGranted !== true && managedTeam.includes(person)) fail(`Unapproved team profile: ${tag}`);
  if (person.image && !publicAsset(person.image)) fail(`Team photo missing from public/: ${tag}`);
}
for (const t of testimonials) if (t.permissionGranted !== true) fail('Unapproved testimonial detected.');
if (agency.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agency.email)) fail('Contact email format invalid.');
if (!agency.email && !agency.calendlyUrl && !process.env.VITE_WEB3FORMS_ACCESS_KEY) warn('No confirmed public contact route configured.');
for (const link of agency.socialLinks || []) if (!urlIsSafe(link.url)) fail(`Social URL not HTTPS: ${link.label || link.id}`);
const html = text('index.html');
if (!/<html\s+lang="[a-z-]+"/i.test(html)) warn('HTML language attribute is missing or unrecognized.');
if (!html.includes('Devnov SEO managed:start')) fail('SEO meta settings missing.');
const robots = text('public/robots.txt');
if (robots.includes('Disallow: /')) warn('SEO is in draft mode (intentional until real domain is ready).');
else if (!html.includes('name="robots" content="index,follow"')) fail('Robots permits crawling, but page SEO is not in publish mode.');
if (!existsSync('public/404.html')) warn('404 fallback page missing.');
const hasDescription = /<meta\s+name="description"/i.test(html);
hasDescription ? pass('HTML page description') : fail('Missing meta description.');
console.log(`\nQuality result: ${failures} failures / ${warnings} pending manual or business items.`);
console.log('Reminder: this does not verify design, live URLs, actual email delivery, accessibility or security.');
if (failures) process.exit(1);