import { createClient } from '@supabase/supabase-js';

const projectUrl = String(import.meta.env.VITE_SUPABASE_URL || '').trim();
// Supabase now calls this the publishable key. The legacy anon variable stays
// supported so existing deployments do not break during migration.
const publishableKey = String(
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '',
).trim();

function isSafeSupabaseUrl(value) {
  try {
    const url = new URL(value);
    return (url.protocol === 'https:' || (url.protocol === 'http:' && /^(localhost|127\.0\.0\.1)$/i.test(url.hostname))) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

/**
 * The browser only ever receives Supabase's publishable key. Table and
 * storage policies in supabase/schema.sql enforce every permission; a service
 * role key must never be placed in a VITE_ variable.
 */
export const isSupabaseConfigured = isSafeSupabaseUrl(projectUrl) && Boolean(publishableKey);
export const projectMediaBucket = 'project-media';

export const supabase = isSupabaseConfigured
  ? createClient(projectUrl, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  : null;
