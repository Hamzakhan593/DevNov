import { existsSync, readFileSync } from 'node:fs';

let failures = 0;
const pass = (message) => console.log(`PASS: ${message}`);
const fail = (message) => { failures += 1; console.error(`FAIL: ${message}`); };
const read = (file) => existsSync(file) ? readFileSync(file, 'utf8') : '';

const requiredFiles = [
  'supabase/schema.sql',
  'supabase/seed.sql',
  'supabase/README.md',
  'src/lib/supabase.js',
  'src/lib/contentRepository.js',
  'src/context/PublicContentContext.jsx',
  'src/components/admin/AdminPage.jsx',
  'src/components/admin/admin.css',
  'scripts/configure-supabase.mjs',
  'BACKEND-GUIDE.md',
  'public/_redirects',
];

for (const file of requiredFiles) {
  if (existsSync(file)) pass(`Required backend file: ${file}`);
  else fail(`Missing backend file: ${file}`);
}

const pkg = JSON.parse(read('package.json') || '{}');
if (pkg.dependencies?.['@supabase/supabase-js']) pass('Supabase browser client dependency');
else fail('Missing @supabase/supabase-js dependency');

const schema = read('supabase/schema.sql');
for (const table of ['profiles', 'projects', 'services', 'technologies', 'project_technologies']) {
  if (new RegExp(`public\\.${table}`).test(schema)) pass(`Schema includes ${table}`);
  else fail(`Schema missing ${table}`);
}
for (const invariant of [
  'enable row level security',
  'public.is_admin()',
  'projects_published_requires_https_live_url',
  "'project-media'",
  'createSignedUrl',
  'project_technologies_public_read_published',
]) {
  if (schema.includes(invariant) || read('src/lib/contentRepository.js').includes(invariant)) pass(`Backend invariant: ${invariant}`);
  else fail(`Backend invariant missing: ${invariant}`);
}

const source = `${read('.env.example')}\n${read('src/lib/supabase.js')}`;
if (/VITE_SUPABASE_(URL|PUBLISHABLE_KEY|ANON_KEY)/.test(source) && !/VITE_SUPABASE_SERVICE_ROLE/.test(source)) pass('Only browser-safe Supabase environment variables are documented');
else fail('Unsafe or incomplete Supabase environment variable configuration');

const app = read('src/App.jsx');
if (app.includes('PublicContentProvider') && app.includes('AdminPage') && app.includes("'/admin'")) pass('Public content provider and protected admin route are mounted');
else fail('App does not mount public content provider and admin route');

if (failures) process.exit(1);
console.log('PASS: Backend source wiring validation completed.');
