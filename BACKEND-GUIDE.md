# DevNov content backend

DevNov now keeps its public design in Vite/React and uses **Supabase** for the
durable backend: Postgres data, authenticated admin access, and private project
media. The public site reads only records that are marked **Published**.

## One-time Supabase setup

1. Create a Supabase project.
2. In **SQL Editor**, run [`supabase/schema.sql`](./supabase/schema.sql), then
   [`supabase/seed.sql`](./supabase/seed.sql). The seed retains the existing
   services and technology stack; it does not overwrite later admin edits.
   It also adds clearly labelled, **unpublished** `[Template]` project drafts
   once, so the former fictional demo cards are never public portfolio work.
3. In **Authentication → Users**, create or invite the first owner account.
   The database trigger creates a non-privileged profile automatically. In SQL
   Editor, promote that exact account:

   ```sql
   select id, email from auth.users;

   update public.profiles
   set role = 'admin'
   where id = '<owner-auth-user-uuid>';
   ```

4. Copy the browser-safe Project URL and **Publishable key** from Supabase
   **Connect** or **Settings → API**, then run this from `E:\DevNov`:

   ```powershell
   npm.cmd run supabase:configure
   ```

   Paste the two values when asked. It creates `.env.local` automatically and
   safely backs up an existing one. Never paste a secret/service-role key,
   database password, or other private secret: Vite exposes `VITE_` values to
   every browser visitor.

5. Run `npm.cmd run dev`, then open `http://127.0.0.1:5173/admin` and sign in.

## Managing client projects

1. Deploy the client project first, on its own domain or hosting provider.
2. In `/admin`, add the case study as a **draft**, fill in its real details,
   select its technologies, and upload an approved screenshot.
3. Add the real HTTPS live URL. The database will not allow publishing without
   it.
4. Mark it **Published** only after the client link, text, and screenshot are
   approved. It immediately becomes eligible for the public portfolio after a
   refresh.

DevNov never embeds, proxies, or takes ownership of client sites. It presents a
case study and opens the independently hosted project in a new tab, which is
the right trust-building flow for a portfolio.

## Former sample projects

The old illustrative cards are disabled in the public frontend. The revised
seed keeps those concepts only as internal `[Template]` drafts, with no hosted
link, screenshot, featured flag, or published flag. They are hidden by Row
Level Security from public visitors.

If your Supabase project was seeded before this change and you want those
reference drafts in the admin area, run the current `seed.sql` again. It uses
insert-only, slug-based seeding: existing services, technologies, templates,
and administrator edits are never overwritten. Before a template is ever
published, replace its title, summary, challenge, solution, outcome, and tech
stack with verified project information, add an approved screenshot, and set
the real HTTPS live URL.

## Security model

- The `/admin` screen is only a user interface; Supabase Row Level Security is
  the real permission boundary.
- Only `profiles.role = 'admin'` can add, edit, reorder, or delete projects,
  services, technology stack entries, project relationships, and images.
- Public visitors can read only published rows.
- `project-media` is private. The site creates a short-lived signed URL only
  for an image attached to a published project. Draft media remains visible to
  administrators only.
- Project live and repository links are HTTPS-only. A published project must
  have a valid HTTPS `live_url`.

## Deployment

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the static host's build
environment and rebuild the site. Vite injects these public values at build
time, so changing them requires a new build/deploy.

`public/_redirects` routes `/admin` back to the React app on hosts that support
Netlify/Cloudflare-style redirects. Confirm the equivalent SPA rewrite if your
host uses another configuration.

## Validation

```powershell
npm.cmd run backend:check
npm.cmd run check
```

The local checks verify source wiring and build the React app. SQL/RLS behavior
must be run in your actual Supabase project; after setup, confirm that an
anonymous visitor cannot create a record, drafts are not public, and an admin
can complete CRUD for all three content types.
