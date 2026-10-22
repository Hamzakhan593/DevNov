/** DevNov owner-only local content utility. No public admin endpoint or credentials. */
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { readFileSync, writeFileSync, renameSync, copyFileSync, mkdirSync, existsSync, statSync, constants, unlinkSync } from 'node:fs';
import { resolve, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const projectDb = resolve(root, 'src/data/projects.json');
const teamDb = resolve(root, 'src/data/team.json');
const backupDir = resolve(root, '_devnov_backups/content-studio');
const allowedExt = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);
const load = (p) => { const v = JSON.parse(readFileSync(p, 'utf8')); if (!Array.isArray(v)) throw new Error(`Expected array: ${p}`); return v; };
const yes = (value) => /^(y|yes)$/i.test(value);
const safeUrl = (value) => !value || (() => { try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password && !/\s/.test(value); } catch { return false; } })();
const askField = async (rl, label, current) => {
  const incoming = (await rl.question(`${label} [${current || '(empty)'}] (Enter=keep, -=clear): `)).trim();
  return incoming === '' ? current : incoming === '-' ? '' : incoming;
};
function persist(file, data) {
  mkdirSync(backupDir, {recursive: true});
  const name = file === projectDb ? 'projects' : 'team';
  const backup = join(backupDir, `${name}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  copyFileSync(file, backup);
  const temporary = `${file}.devnovtmp`;
  try { writeFileSync(temporary, JSON.stringify(data, null, 2) + '\n', 'utf8'); renameSync(temporary, file); }
  catch (error) { if (existsSync(temporary)) unlinkSync(temporary); throw error; }
  console.log(`Saved. Previous data backup: ${backup}`);
}
async function replaceScreenshot(rl, record, type) {
  const inputPath = (await rl.question(`New ${type === 'projects' ? 'screenshot' : 'portrait'} full file path? Enter to retain: `)).trim().replace(/^['"]|['"]$/g, '');
  if (!inputPath) return;
  const original = resolve(inputPath);
  const ext = extname(original).toLowerCase();
  if (!allowedExt.has(ext) || !existsSync(original) || !statSync(original).isFile()) throw new Error('Image must be existing PNG/JPG/WebP/AVIF.');
  if (statSync(original).size > 8 * 1024 * 1024) throw new Error('Image exceeds 8MB. Optimize first.');
  const output = join(root, 'public', type);
  mkdirSync(output, {recursive: true});
  const id = String(record.slug || record.id).replace(/[^a-z0-9-]/g, '');
  const filename = `${id}-${Date.now()}${ext}`;
  copyFileSync(original, join(output, filename), constants.COPYFILE_EXCL);
  record.image = `/${type}/${filename}`;
  if (type === 'projects') record.imageAlt = await askField(rl, 'Screenshot alt text', record.imageAlt || `${record.title} product screenshot`);
}
async function editProject(rl) {
  const entries = load(projectDb);
  if (!entries.length) { console.log('No projects. Choose Add Project to create a real one.'); return; }
  entries.forEach((p) => console.log(`${p.slug} | ${p.title} | ${p.published === false ? 'DRAFT' : 'PUBLISHED'}`));
  const slug = (await rl.question('Project slug to edit: ')).trim();
  const index = entries.findIndex((p) => p.slug === slug);
  if (index < 0) { console.log('No matching managed project.'); return; }
  const p = {...entries[index]};
  for (const field of [['title', 'Project title'], ['summary', 'Short summary'], ['category', 'Category'], ['challenge', 'Problem / challenge'], ['solution', 'Solution'], ['outcome', 'Verified outcome'], ['liveUrl', 'Live URL (HTTPS)'], ['repositoryUrl', 'Source URL (HTTPS)']]) {
    p[field[0]] = await askField(rl, field[1], String(p[field[0]] || ''));
  }
  if (!p.title?.trim() || !p.summary?.trim() || !safeUrl(p.liveUrl) || !safeUrl(p.repositoryUrl)) throw new Error('Title, summary, and HTTPS-only URLs are required/validated. No changes saved.');
  const tech = await askField(rl, 'Technologies (comma-separated)', (p.technologies || []).join(', '));
  p.technologies = tech.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 12);
  await replaceScreenshot(rl, p, 'projects');
  p.featured = yes(await askField(rl, 'Featured? y/n', p.featured ? 'y' : 'n'));
  // Publishing state stays unchanged unless explicitly requested.
  p.published = yes(await askField(rl, 'Published? y/n', p.published !== false ? 'y' : 'n'));
  console.log(`Review: ${p.title} / ${p.category} / ${p.published ? 'PUBLISHED' : 'DRAFT'}`);
  if (!yes((await rl.question('Save project changes? [y/N]: ')).trim())) return console.log('Cancelled.');
  entries[index] = p;
  persist(projectDb, entries);
}
async function editTeam(rl) {
  const entries = load(teamDb);
  if (!entries.length) { console.log('No team profiles. Choose Add Team Member.'); return; }
  entries.forEach((p) => console.log(`${p.id} | ${p.name} | ${p.published === false ? 'DRAFT' : 'PUBLISHED'}`));
  const id = (await rl.question('Member ID to edit: ')).trim();
  const index = entries.findIndex((p) => p.id === id);
  if (index < 0) return console.log('No matching managed profile.');
  const p = {...entries[index]};
  p.name = await askField(rl, 'Name', p.name || '');
  p.role = await askField(rl, 'Role', p.role || '');
  p.summary = await askField(rl, 'Short approved bio', p.summary || '');
  if (!p.name?.trim() || !p.role?.trim()) throw new Error('Name and role are required.');
  await replaceScreenshot(rl, p, 'team');
  const permission = yes(await askField(rl, 'Permission granted by this person? y/n', p.permissionGranted ? 'y' : 'n'));
  p.permissionGranted = permission;
  const published = yes(await askField(rl, 'Publish? y/n', p.published ? 'y' : 'n'));
  if (published && !permission) throw new Error('Cannot publish a person without explicit permission.');
  p.published = published;
  if (!yes((await rl.question('Save profile changes? [y/N]: ')).trim())) return console.log('Cancelled.');
  entries[index] = p;
  persist(teamDb, entries);
}
function status() {
  const projects = load(projectDb), team = load(teamDb);
  console.log(`DevNov CONTENT\n  Projects: ${projects.filter(p => p.published !== false).length} published, ${projects.filter(p => p.published === false).length} drafts\n  Team: ${team.filter(p => p.published !== false).length} published, ${team.filter(p => p.published === false).length} drafts`);
  console.log('Content files: src/data/projects.json / src/data/team.json');
}
function execute(manager, command, rl) {
  rl.pause();
  const result = spawnSync(process.execPath, [join(root, 'scripts', manager), command], {cwd: root, stdio: 'inherit'});
  if (result.error) throw result.error;
  rl.resume();
  if (result.status !== 0) console.log(`Command finished with error ${result.status}.`);
}
async function main() {
  const mode = process.argv[2] || 'menu';
  if (mode === 'status') return status();
  if (mode !== 'menu') throw new Error('Use: node scripts/content-studio.mjs [menu|status]');
  const rl = createInterface({input: stdin, output: stdout});
  try {
    for (;;) {
      console.log('\nDEVNOV LOCAL CONTENT STUDIO (runs only on your computer)');
      console.log('1. Content status  2. Add project  3. Edit project  4. List projects');
      console.log('5. Add team member  6. Edit team member  7. List team  8. Exit');
      const choice = (await rl.question('Choose 1-8: ')).trim();
      if (choice === '8' || !choice) break;
      try {
        if (choice === '1') status();
        else if (choice === '2') execute('manage-projects.mjs', 'add', rl);
        else if (choice === '3') await editProject(rl);
        else if (choice === '4') execute('manage-projects.mjs', 'list', rl);
        else if (choice === '5') execute('manage-team.mjs', 'add', rl);
        else if (choice === '6') await editTeam(rl);
        else if (choice === '7') execute('manage-team.mjs', 'list', rl);
        else console.log('Choose a number 1-8.');
      } catch (error) { console.error('No change saved:', error.message); }
    }
  } finally { rl.close(); }
}
main().catch((error) => { console.error('DevNov content studio error:', error.message); process.exitCode = 1; });
