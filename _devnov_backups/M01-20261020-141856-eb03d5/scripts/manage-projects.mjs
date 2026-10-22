#!/usr/bin/env node
/** Devnov Module 03: safely manage published static case studies. No database. */
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, renameSync, copyFileSync, constants, statSync } from 'node:fs';
import { basename, extname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dataFile = join(root, 'src', 'data', 'projects.json');
const imageDir = join(root, 'public', 'projects');
const mode = (process.argv[2] || 'help').toLowerCase();
const allowedExt = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);
const safeUrl = (url) => !url || /^https:\/\/[^\s]+$/i.test(url);
const slugify = (value) => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64);

function load() {
  const records = JSON.parse(readFileSync(dataFile, 'utf8'));
  if (!Array.isArray(records)) throw new Error('projects.json must contain a JSON array.');
  return records;
}
function save(records) {
  // Write to a temporary file then atomically replace the canonical file.
  const temporary = dataFile + '.tmp';
  writeFileSync(temporary, JSON.stringify(records, null, 2) + '\n', 'utf8');
  renameSync(temporary, dataFile);
}
function print(records) {
  if (!records.length) { console.log('No managed projects. Run: npm.cmd run projects:add'); return; }
  for (const p of records) console.log(`${p.published === false ? '[DRAFT]' : '[LIVE] '} ${p.slug} | ${p.title} | ${p.category || 'Software'}${p.featured ? ' | featured' : ''}`);
}
async function main() {
  const records = load();
  if (mode === 'list') { print(records); return; }
  if (!['add', 'publish', 'unpublish', 'remove'].includes(mode)) {
    console.log('DEVNOV PROJECT MANAGER\n  npm.cmd run projects:add        Add real project + optional screenshot\n  npm.cmd run projects:list       List managed projects\n  npm.cmd run projects:publish    Publish a draft\n  npm.cmd run projects:unpublish  Hide a published project\n  npm.cmd run projects:remove     Remove entry (screenshot file kept)');
    return;
  }
  const rl = createInterface({ input, output });
  const ask = async (text, fallback = '') => (await rl.question(text)).trim() || fallback;
  const need = async (label) => { let value = ''; while (!value) value = await ask(`${label} (required): `); return value; };
  const yes = async (label, defaultYes = false) => /^(y|yes)$/i.test(await ask(`${label} ${defaultYes ? '[Y/n]' : '[y/N]'}: `, defaultYes ? 'y' : 'n'));
  try {
    if (mode === 'add') {
      console.log('\nDEVNOV | ADD A REAL PROJECT\nUse truthful project information only. Empty optional fields are fine.');
      const title = await need('Project title');
      const slug = slugify(title);
      if (!slug) throw new Error('Title must contain letters or numbers to generate a valid slug.');
      if (records.some((p) => p.slug === slug)) throw new Error(`Project slug '${slug}' already exists. Choose a different title.`);
      const summary = await need('Short project description');
      const category = await ask('Category (e.g. Web Application): ', 'Web Application');
      const technologies = (await ask('Technologies (comma separated, e.g. ASP.NET Core, SQL Server): ')).split(',').map((s) => s.trim()).filter(Boolean).slice(0, 12);
      const challenge = await ask('Problem solved (optional): ');
      const solution = await ask('Your solution / approach (optional): ');
      const outcome = await ask('Verified result / outcome (optional, no invented metrics): ');
      const liveUrl = await ask('Live website URL (https:// only, optional): ');
      const repositoryUrl = await ask('GitHub/repository URL (https:// only, optional): ');
      if (!safeUrl(liveUrl) || !safeUrl(repositoryUrl)) throw new Error('Public demo and repository URLs must start with https://.');
      const screenshot = await ask('Screenshot full file path (optional; PNG/JPG/WebP/AVIF): ');
      const featured = await yes('Make featured project?', true);
      const published = await yes('Publish on the website immediately?', true);
      const project = { id: slug, slug, title, summary, category, technologies, challenge, solution, outcome, image: '', imageAlt: '', liveUrl, repositoryUrl, featured, published };
      let screenshotFrom = '';
      let screenshotTo = '';
      if (screenshot) {
        const filePath = resolve(screenshot.replace(/^['"]|['"]$/g, ''));
        const extension = extname(filePath).toLowerCase();
        if (!isAbsolute(filePath) || !existsSync(filePath)) throw new Error(`Screenshot not found: ${filePath}`);
        if (!allowedExt.has(extension)) throw new Error(`Unsupported image type: ${extension}. Allowed: PNG, JPG, JPEG, WebP, AVIF.`);
        if (statSync(filePath).size > 8 * 1024 * 1024) throw new Error('Screenshot exceeds 8 MB; optimize it before importing.');
        mkdirSync(imageDir, { recursive: true });
        screenshotFrom = filePath;
        screenshotTo = join(imageDir, `${slug}${extension}`);
        if (existsSync(screenshotTo)) throw new Error(`Image already exists: ${screenshotTo}; choose another project name or update it manually.`);
        project.image = `/projects/${slug}${extension}`;
        project.imageAlt = await ask('Screenshot alt text (optional): ', `${title} application screenshot`);
      }
      if (screenshotTo) copyFileSync(screenshotFrom, screenshotTo, constants.COPYFILE_EXCL);
      try { save([...records, project]); }
      catch (err) { console.error('Could not save project. Imported image may remain at: ' + screenshotTo); throw err; }
      console.log(`\nPASS: ${title} ${published ? 'published' : 'saved as draft'}`);
      console.log('Data: src/data/projects.json');
      if (project.image) console.log('Image: public' + project.image);
      console.log('To verify: npm.cmd run check');
      return;
    }
    print(records);
    if (!records.length) return;
    const slug = await need('Enter exact project slug');
    const match = records.find((p) => p.slug === slug);
    if (!match) throw new Error(`Project '${slug}' not found.`);
    if (mode === 'remove') {
      if (await ask(`Type DELETE ${slug} to confirm removal (image remains on disk): `) !== `DELETE ${slug}`) { console.log('Cancelled.'); return; }
      save(records.filter((p) => p.slug !== slug));
      console.log(`Removed ${slug}. Screenshot file was retained.`);
    } else {
      match.published = mode === 'publish';
      save(records);
      console.log(`${slug}: ${match.published ? 'published' : 'hidden'} on the website.`);
    }
  } finally { rl.close(); }
}

main().catch((error) => { console.error('ERROR:', error.message); process.exitCode = 1; });