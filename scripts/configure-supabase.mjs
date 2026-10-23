import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { stdin as input, stdout as output } from 'node:process';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envFile = resolve(projectRoot, '.env.local');
const supabaseSetting = /^\s*VITE_SUPABASE_(?:URL|PUBLISHABLE_KEY|ANON_KEY)\s*=/;

function normalizeProjectUrl(value) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    return url.origin;
  } catch {
    return null;
  }
}

function isBrowserSafeKey(value) {
  const key = value.trim();
  return /^sb_publishable_[A-Za-z0-9_-]+$/.test(key) || /^eyJ[A-Za-z0-9._-]+$/.test(key);
}

async function askForValue(rl, label, validate, helpText) {
  while (true) {
    const value = (await rl.question(`${label}: `)).trim();
    if (validate(value)) return value;
    console.log(`That does not look valid. ${helpText}`);
  }
}

function buildEnvFile(url, key) {
  const previous = existsSync(envFile) ? readFileSync(envFile, 'utf8') : '';
  const preserved = previous
    .split(/\r?\n/)
    .filter((line) => !supabaseSetting.test(line))
    .join('\n')
    .replace(/\n+$/, '');
  const keyName = key.startsWith('sb_publishable_')
    ? 'VITE_SUPABASE_PUBLISHABLE_KEY'
    : 'VITE_SUPABASE_ANON_KEY';
  const prefix = preserved ? `${preserved}\n\n` : '';

  return `${prefix}# DevNov content backend (public browser values only)\nVITE_SUPABASE_URL=${url}\n${keyName}=${key}\n`;
}

const rl = createInterface({ input, output });

try {
  console.log('DevNov Supabase configuration');
  console.log('Paste only the Project URL and publishable key from Supabase.');
  console.log('Never paste a secret/service-role key here.\n');

  const urlInput = await askForValue(
    rl,
    'Supabase Project URL',
    (value) => Boolean(normalizeProjectUrl(value)),
    'Use an https URL such as https://your-project.supabase.co.',
  );
  const key = await askForValue(
    rl,
    'Publishable key (sb_publishable_...)',
    isBrowserSafeKey,
    'Use a key beginning sb_publishable_. A legacy anon JWT key is also accepted.',
  );
  const url = normalizeProjectUrl(urlInput);

  if (existsSync(envFile)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backup = `${envFile}.backup-${timestamp}`;
    copyFileSync(envFile, backup);
    console.log(`Existing .env.local backed up to ${backup}`);
  }

  writeFileSync(envFile, buildEnvFile(url, key), { encoding: 'utf8', mode: 0o600 });
  console.log('\nCreated .env.local successfully.');
  console.log('Restart `npm.cmd run dev`, then open http://127.0.0.1:5173/admin');
} catch (error) {
  console.error(`\nSupabase configuration was not completed: ${error.message}`);
  process.exitCode = 1;
} finally {
  rl.close();
}
