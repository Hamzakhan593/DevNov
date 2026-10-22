/** DevNov site content manager: no database, no network and no secret storage. */
import { readFileSync, writeFileSync, renameSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { agency } from '../src/data/agencyData.js';

const file = 'src/data/siteConfig.json';
const recognizedKeys = ['headline', 'summary', 'email', 'calendlyUrl', 'socialLinks'];
const profiles = [
  ['github', 'GitHub'], ['linkedin', 'LinkedIn'], ['instagram', 'Instagram'],
  ['facebook', 'Facebook'], ['youtube', 'YouTube'], ['behance', 'Behance'],
  ['dribbble', 'Dribbble'], ['website', 'Website'],
];
const safeLink = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password &&
      url.hostname.includes('.') && !/^(localhost|127\.|10\.|192\.168\.|0\.)/i.test(url.hostname) &&
      !/\.(example|test|invalid|local)$/i.test(url.hostname) && !/\s/.test(value);
  } catch { return false; }
};
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const err = (message) => { console.error('ERROR:', message); process.exitCode = 1; };
function validate(data) {
  const errors = [];
  if (!data || typeof data !== 'object' || Array.isArray(data)) return ['Site config must be a JSON object.'];
  for (const key of Object.keys(data)) if (!recognizedKeys.includes(key)) errors.push(`Unknown config key: ${key}`);
  for (const key of ['headline', 'summary', 'email', 'calendlyUrl']) {
    if (data[key] !== undefined && typeof data[key] !== 'string') errors.push(`${key} must be text.`);
  }
  if (data.headline?.length > 140) errors.push('Headline too long (140 max).');
  if (data.summary?.length > 500) errors.push('Summary too long (500 max).');
  if (data.email && !isEmail(data.email)) errors.push('Invalid email.');
  if (data.calendlyUrl && !safeLink(data.calendlyUrl)) errors.push('Booking URL must be a public HTTPS URL.');
  if (data.socialLinks !== undefined) {
    if (!Array.isArray(data.socialLinks)) errors.push('socialLinks must be an array.');
    else {
      const ids = new Set();
      for (const link of data.socialLinks) {
        if (!link || typeof link !== 'object' || !profiles.some(([id]) => id === link.id) ||
            !link.label || !safeLink(link.url)) errors.push('Invalid social profile entry.');
        if (ids.has(link?.id)) errors.push(`Duplicate social profile: ${link.id}`);
        ids.add(link?.id);
      }
    }
  }
  return errors;
}
function get() {
  if (!existsSync(file)) throw new Error(`Missing ${file}; rerun Module 10 installer.`);
  const parsed = JSON.parse(readFileSync(file, 'utf8'));
  const errors = validate(parsed);
  if (errors.length) throw new Error(errors.join(' | '));
  return parsed;
}
function store(data) {
  const errors = validate(data);
  if (errors.length) throw new Error(errors.join(' | '));
  const backup = join('.devnov-backups', 'site-settings');
  mkdirSync(backup, { recursive: true });
  const stamp = new Date().toISOString().replaceAll(/[:.]/g, '-');
  copyFileSync(file, join(backup, `siteConfig-${stamp}.json`));
  const temp = `${file}.tmp`;
  writeFileSync(temp, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  renameSync(temp, file);
}
function display(config) {
  const effective = { ...agency, ...config };
  console.log('\nDEVNOV / SITE CONTENT');
  console.log('Brand: DevNov (locked)');
  console.log('Headline:', effective.headline);
  console.log('Summary:', effective.summary);
  console.log('Public email:', effective.email || '(not set)');
  console.log('Meeting link:', effective.calendlyUrl || '(not set)');
  for (const [id, label] of profiles) {
    const found = (effective.socialLinks || []).find((link) => link.id === id);
    if (found) console.log(`${label}: ${found.url}`);
  }
  console.log('Note: editing config does not deploy your site; rebuild and redeploy.\n');
}
async function run() {
  const action = process.argv[2] || 'show';
  if (!['setup', 'show', 'check'].includes(action)) return err('Usage: npm run site:setup | site:show | site:check');
  const current = get();
  if (action === 'show') return display(current);
  if (action === 'check') {
    console.log('PASS: Site content JSON and allowed URL fields are valid.');
    if (!agency.email) console.log('PENDING: A verified public email is not configured.');
    if (!(agency.socialLinks || []).length) console.log('PENDING: No public social links configured.');
    return;
  }
  const rl = createInterface({ input, output });
  const updated = structuredClone(current);
  try {
    console.log('Edit public details (ENTER keeps current, - clears a field).');
    console.log('Do not enter private API keys, passwords, or invented client claims.\n');
    for (const [key, label, length] of [
      ['headline', 'Agency headline', 140], ['summary', 'Agency description', 500],
      ['email', 'Verified public email', 180], ['calendlyUrl', 'Booking HTTPS URL', 500],
    ]) {
      const old = updated[key] ?? agency[key] ?? '';
      const answer = (await rl.question(`${label} [${old || 'not set'}]: `)).trim();
      if (!answer) continue;
      const value = answer === '-' ? '' : answer;
      if (value.length > length) { console.log(`Skipped (maximum ${length} characters).`); continue; }
      if (key === 'email' && value && !isEmail(value)) { console.log('Skipped invalid email.'); continue; }
      if (key === 'calendlyUrl' && value && !safeLink(value)) { console.log('Skipped invalid HTTPS URL.'); continue; }
      updated[key] = value;
    }
    let social = Array.isArray(updated.socialLinks) ? [...updated.socialLinks] : [...(agency.socialLinks || [])];
    for (const [id, label] of profiles) {
      const prior = social.find((p) => p.id === id);
      const answer = (await rl.question(`${label} URL [${prior?.url || 'not set'}]: `)).trim();
      if (!answer) continue;
      if (answer === '-') social = social.filter((p) => p.id !== id);
      else if (!safeLink(answer)) console.log('Skipped invalid HTTPS URL.');
      else social = [...social.filter((p) => p.id !== id), { id, label, url: answer }];
    }
    updated.socialLinks = social;
    const errors = validate(updated);
    if (errors.length) throw new Error(errors.join(' | '));
    console.log('\nUPDATED PREVIEW');
    display(updated);
    const save = (await rl.question('Save these public settings? [y/N]: ')).trim().toLowerCase();
    if (save !== 'y' && save !== 'yes') { console.log('Cancelled. No changes saved.'); return; }
    store(updated);
    console.log('Saved. Run npm.cmd run check and npm.cmd run dev to preview.');
  } finally { rl.close(); }
}
run().catch((error) => err(error.message));