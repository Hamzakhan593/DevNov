import { existsSync, readFileSync } from 'node:fs';
import { agency } from '../src/data/agencyData.js';
let failures = 0;
const check = (condition, detail) => {
  console.log(`${condition ? 'PASS' : 'FAIL'}: ${detail}`);
  if (!condition) failures++;
};
const source = readFileSync('src/data/agencyData.js', 'utf8');
const config = JSON.parse(readFileSync('src/data/siteConfig.json', 'utf8'));
check(source.includes("import siteOverrides from './siteConfig.json' with { type: 'json' };"), 'Static settings import');
check(source.includes('export const agency = { ...agencyDefaults, ...siteOverrides };'), 'Site settings merged into agency data');
check(agency.brandName === 'DevNov', 'Brand stays DevNov');
check(typeof config === 'object' && !Array.isArray(config), 'Site settings are a JSON object');
check(existsSync('scripts/manage-site.mjs'), 'Site content terminal manager');
check(existsSync('SITE-CONTENT-GUIDE.md'), 'Content editor guide');
if (failures) process.exit(1);
console.log('PASS: Module 10 integration checks complete.');