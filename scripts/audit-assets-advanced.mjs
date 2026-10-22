/** DevNov asset integrity audit: local only; never calls external domains. */
import { readFileSync, statSync, existsSync, readdirSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const db = (name) => JSON.parse(readFileSync(resolve(root, 'src/data', name), 'utf8'));
const projects = db('projects.json'), team = db('team.json');
let failures = 0, warnings = 0;
const fail = (s) => { failures++; console.error(`FAIL ${s}`); };
const warn = (s) => { warnings++; console.log(`WARN ${s}`); };
const pass = (s) => console.log(`PASS ${s}`);
function checkImage(kind, record) {
  const who = record.slug || record.id || record.title || record.name || '(unnamed)';
  const publicDir = kind === 'projects' ? 'projects' : 'team';
  if (!record.image) { warn(`${kind}/${who}: no photo; fallback shown`); return; }
  if (typeof record.image !== 'string' || !new RegExp(`^/${publicDir}/[a-z0-9._-]+\\.(png|jpg|jpeg|webp|avif)$`, 'i').test(record.image)) { fail(`${kind}/${who}: unsafe image path`); return; }
  const file = resolve(root, 'public', record.image.slice(1));
  if (!existsSync(file)) return fail(`${kind}/${who}: missing file ${record.image}`);
  const len = statSync(file).size;
  if (len > 1024 * 1024) warn(`${kind}/${who}: ${(len / 1048576).toFixed(1)}MB asset, optimize for speed`);
  if (len > 8 * 1024 * 1024) fail(`${kind}/${who}: asset over 8MB`);
  const bytes = readFileSync(file).subarray(0, 16);
  const ext = extname(file).toLowerCase();
  const ok = ext === '.png' ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
    : ext === '.jpg' || ext === '.jpeg' ? bytes[0] === 255 && bytes[1] === 216
    : ext === '.webp' ? bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP'
    : ext === '.avif' ? bytes.toString('ascii', 4, 8) === 'ftyp' : false;
  ok ? pass(`${kind}/${who}: image exists, extension/signature matches`) : fail(`${kind}/${who}: extension/signature mismatch`);
  if (kind === 'projects' && !String(record.imageAlt || '').trim()) warn(`${kind}/${who}: missing screenshot description`);
}
function validHttps(v) { try { const u = new URL(v); return u.protocol === 'https:' && !u.username && !u.password && !/\s/.test(v); } catch { return false; } }
const slugs = new Set();
for (const p of projects) {
  if (p.published === false) continue;
  const id = p.slug || p.id;
  if (slugs.has(id)) fail(`duplicate project identifier: ${id}`); else slugs.add(id);
  if (!p.title?.trim() || !p.summary?.trim()) fail(`project ${id}: title and summary required`);
  for (const key of ['liveUrl', 'repositoryUrl']) if (p[key] && !validHttps(p[key])) fail(`project ${id}: ${key} must be HTTPS`);
  checkImage('projects', p);
}
for (const p of team) {
  if (p.published === false) continue;
  if (p.permissionGranted !== true) fail(`team ${p.id}: explicit permission is required`);
  if (!p.name?.trim() || !p.role?.trim()) fail(`team ${p.id}: missing name/role`);
  checkImage('team', p);
}
if (!projects.some((p) => p.published !== false)) warn('Portfolio is empty. Publish genuine work before promoting launch.');
if (!team.some((p) => p.published !== false)) warn('Team is empty. Publish actual profiles only with consent.');
const index = readFileSync(resolve(root, 'index.html'), 'utf8');
if (!index.includes('DevNov')) fail('Brand name missing in HTML title/meta.');
for (const required of ['public/favicon.svg', 'public/_headers', 'public/robots.txt']) {
  if (!existsSync(resolve(root, required))) fail(`Missing critical static asset ${required}`);
}
console.log(`DevNov asset audit: ${failures} failure(s), ${warnings} advisory warning(s).`);
if (failures) process.exitCode = 1;
