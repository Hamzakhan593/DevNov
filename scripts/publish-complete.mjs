/** Only run on a real verified production HTTPS origin. */
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const domain = process.argv[2];
if (!domain) { console.error('Usage: node scripts/publish-complete.mjs https://your-owned-domain.com'); process.exit(1); }
for (const args of [['seo.mjs','publish',domain], ['social-seo.mjs']]) {
  const r = spawnSync(process.execPath, [resolve(root,'scripts', args[0]), ...args.slice(1)], {cwd:root, stdio:'inherit'});
  if (r.status !== 0) process.exit(r.status || 1);
}
console.log('DevNov production SEO staged. Run npm.cmd run check and audit the built website before deployment.');
