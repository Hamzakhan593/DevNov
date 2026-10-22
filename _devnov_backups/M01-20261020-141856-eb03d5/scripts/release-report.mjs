import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { agency, projects as legacyProjects, team as legacyTeam, testimonials } from '../src/data/agencyData.js';
import managedProjects from '../src/data/projects.json' with { type: 'json' };
import managedTeam from '../src/data/team.json' with { type: 'json' };

const good = [];
const pending = [];
const blockers = [];
const add = (arr, label) => arr.push(label);
const publishedProjects = [...managedProjects, ...legacyProjects].filter((p) => p.published !== false);
const publishedTeam = [...managedTeam, ...legacyTeam].filter((p) => p.published !== false);
const robots = readFileSync('public/robots.txt', 'utf8');
const html = readFileSync('index.html', 'utf8');

if (existsSync('dist/index.html')) add(good, 'Production dist/index.html exists (build may still need redeploy).');
else add(blockers, 'Production build missing. Run npm.cmd run build.');
if (publishedProjects.length) add(good, `${publishedProjects.length} published project entries (verify they are genuine).`);
else add(pending, 'Publish at least one genuine case study with details and screenshot.');
if (publishedTeam.length) add(good, `${publishedTeam.length} team profiles published (verify consent).`);
else add(pending, 'Team section is empty. Add approved owner profiles if desired.');
if (publishedTeam.some((p) => managedTeam.includes(p) && p.permissionGranted !== true)) add(blockers, 'Unapproved published team profile found.');
if (testimonials.some((p) => p.permissionGranted !== true)) add(blockers, 'Unapproved testimonial present.');
if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agency.email || '')) add(good, 'Public contact email configured.');
else add(pending, 'Verified contact email not configured.');
if (agency.calendlyUrl) add(good, 'Calendar URL configured (manual link verification needed).');
else add(pending, 'Booking link not configured (optional).');
const keyInLocalFile = existsSync('.env.local') && /^VITE_WEB3FORMS_ACCESS_KEY=.+/m.test(readFileSync('.env.local','utf8'));
if (process.env.VITE_WEB3FORMS_ACCESS_KEY || keyInLocalFile) add(good, 'Web3Forms key appears configured (real submission must be tested).');
else add(pending, 'Web3Forms access key not configured (form inactive).');
if ((agency.socialLinks || []).length) add(good, 'Social profile links configured (verify live profiles).');
else add(pending, 'Verified social links not configured.');
if (robots.includes('Disallow: /') || html.includes('noindex,nofollow')) add(pending, 'SEO draft/noindex is active. Keep until launch and real HTTPS domain approval.');
else if (!html.includes('rel="canonical"') || !existsSync('public/sitemap.xml')) add(blockers, 'Indexing enabled without complete production canonical/sitemap.');
else add(good, 'Production SEO metadata and sitemap present; verify real domain.');
add(pending, 'Verify GDPR/privacy disclosures and business policies for the locations served.');
add(pending, 'Perform manual mobile/tablet/desktop, keyboard and screen-reader testing.');
add(pending, 'Verify email delivery and deployed assets, links, headers, analytics behavior and SSL.');
const createdAt = new Date().toISOString();
const status = blockers.length ? 'BLOCKED' : pending.length ? 'NEEDS_OWNER_REVIEW' : 'TECHNICALLY_READY_FOR_OWNER_REVIEW';
const report = { createdAt, brand: 'Devnov', status, summary: { checksPassed: good.length, ownerActions: pending.length, blockers: blockers.length }, passed: good, pending, blockers };
mkdirSync('reports', { recursive: true });
writeFileSync('reports/release-status.json', `${JSON.stringify(report, null, 2)}\n`);
writeFileSync('reports/release-status.md', [
  '# Devnov launch readiness report', '', `Generated: ${createdAt}`, `Status: ${status}`, '',
  '## Passed checks', ...good.map((x) => `- ${x}`), '',
  '## Owner actions / manual verification', ...pending.map((x) => `- [ ] ${x}`), '',
  '## Blocking issues', ...(blockers.length ? blockers.map((x) => `- [ ] ${x}`) : ['- None detected by the limited automated report.']), '',
  'The report is not proof of live deployment, legal compliance or accessibility conformance.', '',
].join('\n'));
console.log('Devnov release report:', status);
console.log(`Checks: ${good.length} passed, ${pending.length} pending, ${blockers.length} blockers.`);
console.log('Files: reports/release-status.md and reports/release-status.json');
if (blockers.length) process.exitCode = 1;