# Devnov | Company information management

Run these from the `E:\DevNov` terminal:

```powershell
npm.cmd run site:setup
npm.cmd run site:show
npm.cmd run site:check
```

`site:setup` updates **public** company details (headline, summary, verified email, meeting URL, social profiles) in `src/data/siteConfig.json`. This file is committed with the site; **never put private API keys, credentials, or unpublished information in it**. Previous content settings are backed up under `.devnov-backups/site-settings/`.

Content used by your React components comes from `src/data/agencyData.js`. Module 10 merges in `siteConfig.json` so you can update details without modifying JSX. Existing default content still works if the JSON file is empty.

**Projects:** `npm.cmd run projects:add` / `projects:list` / `projects:publish`. Use only real work, accurate descriptions, licensed screenshots and working links. **Team:** `npm.cmd run team:add` / `team:list` / `team:publish` and get permission before publishing photos/bios. Both are managed separately.

**Contact form:** Web3Forms uses a **browser-visible access key** (`VITE_WEB3FORMS_ACCESS_KEY`) configured in `.env.local` (already supported since Module 07), or hosting build environment. Restart Vite after changing `.env.local`. Do not put private keys or credentials in any `VITE_` variable. Independently verify real message delivery.

**Hosting:** After any changes, run `npm.cmd run check`, then commit and redeploy. Static builds do not update hosted sites until redeployment. Indexing is deliberately left in draft mode unless you explicitly publish SEO with a verified domain.