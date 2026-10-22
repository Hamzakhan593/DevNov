/** DevNov preflight: objective source/build checks + explicit manual launch blockers. */
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const read = (name) => readFileSync(resolve(root, name), 'utf8');
const project = JSON.parse(read('src/data/projects.json'));
const team = JSON.parse(read('src/data/team.json'));
const config = JSON.parse(read('src/data/siteConfig.json'));
const html = read('index.html');
const rows = [];
function check(label, ok, critical = false) { rows.push({label, result: ok ? 'PASS' : critical ? 'BLOCKER' : 'PENDING'}); console.log(`${ok ? 'PASS' : critical ? 'BLOCKER' : 'PENDING'} ${label}`); }
check('Exact DevNov branding', html.includes('DevNov'), true);
check('At least one genuine published project', project.some((p) => p.published !== false));
check('At least one approved team member', team.some((p) => p.permissionGranted === true && p.published !== false));
check('Public contact inbox (owner must verify delivery)', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email || ''));
check('Indexing explicitly published for verified domain', html.includes('name="robots" content="index,follow"'));
check('Social share card exists', existsSync(resolve(root, 'public/social-card.png')));
check('Social metadata configured for canonical URL', html.includes('DevNov share managed:start') && html.includes('og:image'));
check('Build output exists', existsSync(resolve(root, 'dist/index.html')));
const commands = [['Node check', [resolve(root, 'scripts/audit-assets-advanced.mjs')]], ['DevNov redesign check', [resolve(root, 'scripts/verify-redesign.mjs')]]];
for (const [label, argv] of commands) {
  const outcome = spawnSync(process.execPath, argv, {cwd:root, stdio:'inherit'});
  check(label, outcome.status === 0, true);
}
const summary = ['# DevNov Advanced Release Preflight', '', ...rows.map(({label,result}) => `- ${result}: ${label}`), '', 'Manual review still required:', '- Open the website on real desktop/mobile devices and check responsiveness.', '- Submit real contact form and verify receipt; do not include secrets in git.', '- Open deep-linked case studies and test mobile menu/keyboard.', '- Verify project images, links, copyright rights, owner consent and business email.', '- Review live HTTPS domain and release deployment provider configuration.', ''];
const report = resolve(root, 'DEVNOV-ADVANCED-PREFLIGHT.md');
writeFileSync(report, summary.join('\n'), 'utf8');
console.log(`Report generated: ${report}`);
if (rows.some((r) => r.result === 'BLOCKER')) process.exitCode = 1;
