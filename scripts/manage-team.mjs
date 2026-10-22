import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync, unlinkSync, constants } from 'node:fs';
import { resolve, basename, extname } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { team as legacyTeam } from '../src/data/agencyData.js';

const dbPath = resolve('src/data/team.json');
const read = () => JSON.parse(readFileSync(dbPath, 'utf8'));
const persist = (profiles) => { const tmp = dbPath + '.tmp'; try { writeFileSync(tmp, JSON.stringify(profiles, null, 2) + '\n'); renameSync(tmp, dbPath); } finally { if (existsSync(tmp)) unlinkSync(tmp); } };
const mode = process.argv[2] || 'list';
const slugify = (value) => value.trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g,'').slice(0, 70);
const rl = createInterface({input, output});
async function ask(label, defaultValue = '') { const value = (await rl.question(`${label}${defaultValue ? ` [${defaultValue}]` : ''}: `)).trim(); return value || defaultValue; }
const safeUrl = (url) => !url || /^https:\/\/[a-z0-9.-]+(?:\:[0-9]+)?(?:[/?#][^\s]*)?$/i.test(url);
try {
  let people = read();
  if (mode === 'list') { if (!people.length && !legacyTeam.length) console.log('No team profiles yet. Use npm.cmd run team:add.'); [...people, ...legacyTeam].forEach((person) => console.log(`${person.id} | ${person.name} | ${person.role} | ${person.published === false ? 'DRAFT' : 'PUBLISHED'}`)); }
  else if (mode === 'add') {
    const name = await ask('Full name'); if (!name) throw new Error('Name required.');
    const id = slugify(name); if (!id || [...people,...legacyTeam].some((p) => p.id === id)) throw new Error('Duplicate or invalid profile ID.');
    const role = await ask('Role / title'); if (!role) throw new Error('Role required.');
    const summary = await ask('Short approved bio (optional)');
    const imageFile = await ask('Local portrait image path (optional)');
    const label = await ask('Profile link label, e.g. LinkedIn (optional)');
    const url = label ? await ask('HTTPS profile URL') : ''; if (!safeUrl(url) || (label && !url)) throw new Error('Profile link must be a valid HTTPS URL.');
    const approved = (await ask('Has this person approved publishing the profile? [yes/no]', 'no')).toLowerCase() === 'yes';
    const publish = approved && (await ask('Publish now? [yes/no]', 'no')).toLowerCase() === 'yes';
    let image = '';
    if (imageFile) {
      const from = resolve(imageFile.replace(/^"|"$/g, ''));
      const ext = extname(from).toLowerCase(); if (!['.png','.jpg','.jpeg','.webp','.avif'].includes(ext) || !existsSync(from)) throw new Error('Portrait must be an existing PNG/JPG/WebP/AVIF file.');
      mkdirSync(resolve('public/team'), { recursive: true });
      const destName = `${id}-${Date.now()}${ext}`;
      copyFileSync(from, resolve('public/team', destName), constants.COPYFILE_EXCL);
      image = `/team/${destName}`;
    }
    const profile = { id, name, role, summary, image, links: label && url ? [{label,url}] : [], published: publish, permissionGranted: approved };
    people.push(profile); persist(people);
    console.log(`Saved ${id} as ${publish ? 'PUBLISHED' : 'DRAFT'}.`);
  }
  else if (['publish','unpublish','remove'].includes(mode)) {
    const id = await ask('Profile ID'); const index = people.findIndex((p) => p.id === id); if (index === -1) throw new Error('Profile not found in managed store.');
    if (mode === 'publish') { if (!people[index].permissionGranted) throw new Error('Cannot publish without recorded permission.'); people[index].published = true; }
    else if (mode === 'unpublish') people[index].published = false;
    else { const sure = await ask('Type REMOVE to delete record (images kept)'); if (sure !== 'REMOVE') throw new Error('Cancelled.'); people.splice(index, 1); }
    persist(people); console.log(`Updated profile ${id}.`);
  } else throw new Error('Unknown command. Use list/add/publish/unpublish/remove.');
} catch (error) { console.error('ERROR:', error.message); process.exitCode = 1; } finally { rl.close(); }