# DevNov deployment and SEO readiness

The React/Vite frontend still deploys as static files, but its portfolio CMS now
uses Supabase for the database, authentication, and private project media. See
[BACKEND-GUIDE.md](./BACKEND-GUIDE.md) to create the Supabase project, run the
schema/seed SQL, and promote the first administrator before deployment.

Run the following in `E:\DevNov`:

```powershell
npm.cmd run backend:check
npm.cmd run check
npm.cmd run audit:site
npm.cmd run build
```

Deploy `dist/` to a static host such as Cloudflare Pages (build command `npm run build`, output `dist`) or Netlify. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to that host's **build environment**, then rebuild. You do not need a separate Node API server, but the Supabase backend is required for live CMS content.

Ensure `/admin` rewrites to `/index.html`; `public/_redirects` already covers
Cloudflare/Netlify-style hosts. Configure the equivalent SPA rewrite if your
host uses a different format.

**Before going public:**

- Add projects, services, and technologies through `/admin`. For each client
  project, deploy it first, then add its real HTTPS link and approved screenshot
  before publishing it.
- Add owner/team profiles with `npm run team:add` and record consent before publishing; no invented people or testimonials.
- Set a verified email in `src/data/agencyData.js`, optionally Calendly or Web3Forms (`CONTACT-GUIDE.md`). Confirm actual form delivery.
- Add verified social profile links to `agency.socialLinks` in `src/data/agencyData.js`.
- Write your own privacy notice covering contact submission and providers, appropriate to the places you serve.
- Test mobile navigation, keyboard navigation, project details, broken links, images and contact submission in a browser.
- Confirm the domain and run `npm.cmd run seo:publish -- https://YOUR-REAL-DOMAIN.com` (use your real domain). The command generates canonical, robots.txt and sitemap.xml. It enables indexing, so do this only when ready.
- Run `npm.cmd run build` again, then redeploy `dist/`.

**Draft mode:** `npm.cmd run seo:draft` reinstates noindex, removes production canonical and sitemap, and disallows crawling through `robots.txt` when the site is incomplete.

The `public/_headers` file adds security and caching headers on hosting providers that recognize Cloudflare Pages `_headers` syntax; other hosts need their own header configuration. No server-side access restrictions are implied by these headers.

## Testing status

The installers provide structural source checks and Vite build checks. They do not constitute cross-device visual QA, accessibility certification, penetration testing, server-side spam protection or verified email delivery. Complete those manual checks before treating the site as launched.
