import { existsSync, readFileSync } from 'node:fs';
let errors = 0;
for (const path of ['scripts/qa-site.mjs','public/404.html','QA-MANUAL-GUIDE.md']) {
  const ok = existsSync(path);
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${path}`);
  if (!ok) errors++;
}
const fallback = readFileSync('public/404.html','utf8');
if (!fallback.includes('href="/"') || !fallback.includes('404')) { console.error('FAIL: 404 fallback navigation'); errors++; }
if (errors) process.exit(1);
console.log('PASS: Module 11 QA tools are installed.');