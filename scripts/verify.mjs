import { existsSync } from 'node:fs';
import { agency, contact, faq, processSteps, projects, services, team, technologies, testimonials } from '../src/data/agencyData.js';

const mandatoryFiles = [
  'index.html', 'vite.config.js', 'src/main.jsx', 'src/index.css', 'src/App.jsx',
  'src/components/layout/Navbar.jsx', 'src/components/layout/Footer.jsx',
  'src/components/ui/ProjectCard.jsx', 'src/components/ui/SectionHeader.jsx',
  ...['Hero', 'TechMarquee', 'FeaturedWork', 'Services', 'Process', 'WhyUs', 'FAQ', 'Contact'].map((name) => `src/components/sections/${name}.jsx`),
  'src/data/agencyData.js', 'tech-stack.md', 'progress.md',
];

const fail = (message) => { console.error(`FAIL: ${message}`); process.exitCode = 1; };
const pass = (message) => console.log(`PASS: ${message}`);
const warn = (message) => console.warn(`PENDING: ${message}`);
for (const file of mandatoryFiles) {
  if (!existsSync(file)) fail(`Required file missing: ${file}`);
}
if (mandatoryFiles.every(existsSync)) pass(`Folder structure (${mandatoryFiles.length} files)`);

if (agency.brandName !== 'DevNov') fail('Brand name must be DevNov');
else pass('Brand name: DevNov');

function validateRecords(records, label) {
  if (!Array.isArray(records)) return fail(`${label} must be an array`);
  const ids = records.map((record) => record.id);
  if (ids.some((id) => typeof id !== 'string' || !id.trim()) || new Set(ids).size !== ids.length) fail(`${label} contains blank or duplicate IDs`);
  else pass(`${label}: ${records.length} records with unique IDs`);
}
for (const [label, records] of Object.entries({ services, technologies, projects, team, testimonials, processSteps, faq })) validateRecords(records, label);
if (!agency.email) warn('Verified email not configured');
if (!agency.calendlyUrl) warn('Calendly URL not configured');
if (!contact.accessKey) warn('Web3Forms access key not configured; no contact form is active');
if (!projects.length) warn('No real projects published yet');
if (!team.length) warn('Team profiles await approved information');
if (!testimonials.length) warn('Testimonials intentionally empty; no fabricated claims');

if (process.exitCode) process.exit(process.exitCode);
pass('Module 1 static data validation completed');