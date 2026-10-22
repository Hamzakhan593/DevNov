import { existsSync, readFileSync } from 'node:fs';
const pkg = JSON.parse(readFileSync('package.json','utf8'));
const tests = [
  ['scripts/release-report.mjs','Release report generator'],
  ['LAUNCH-CHECKLIST.md','Deployment guide'],
  ['scripts/verify-module12.mjs','Module 12 verifier'],
];
let failed = 0;
for (const [file, label] of tests) {
  const ok = existsSync(file);
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${label}`);
  if (!ok) failed++;
}
for (const key of ['site:setup','site:check','qa:content','release:report','release:prepare']) {
  const ok = typeof pkg.scripts?.[key] === 'string';
  console.log(`${ok ? 'PASS' : 'FAIL'}: npm script ${key}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
console.log('PASS: Module 12 release tools integrated.');