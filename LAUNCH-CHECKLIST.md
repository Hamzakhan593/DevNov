# Devnov launch — technical steps and owner sign-off

From the `E:\DevNov` terminal:

```powershell
npm.cmd run site:setup
npm.cmd run site:check
npm.cmd run projects:list
npm.cmd run team:list
npm.cmd run release:prepare
```

The last command runs core checks, offline QA, a Vite production build, the existing site audit and a launch report. Review `reports/release-status.md` and complete all pending items. **A green build does not mean the website is launched.**

## Static hosting (Cloudflare Pages example)

1. Create your own Git repository or upload `dist/` with an approved host mechanism. Do not upload `.env.local`.
2. For a Pages Git integration, use build command `npm run build`, output directory `dist`, and the Node version supported by your Vite version.
3. Configure your custom domain and HTTPS on the hosting service. Cloudflare Pages serves the static `dist/` output and supports `public/_headers`, but rules vary by provider.
4. If using Web3Forms, add `VITE_WEB3FORMS_ACCESS_KEY` in hosting build environment (public client-side key) and test an actual message.
5. **Only once content and domain are approved:** `npm.cmd run seo:publish -- https://YOUR-REAL-DOMAIN.example` using your actual HTTPS domain. Replace the illustration domain; never publish with a sample domain.
6. Rebuild and redeploy after SEO publishing. Verify `robots.txt`, `sitemap.xml`, canonical URL and actual HTTP responses on the live site.
7. Review legal/privacy text and ensure your claims, images and screenshots have authorization.

If unfinished, keep draft SEO via `npm.cmd run seo:draft`. **Do not use `seo:publish` without domain ownership.**

## Production sign-off

- [ ] Every published project is factual, has a licensed screenshot, useful summary and working links.
- [ ] Team bios/photos are approved by those people.
- [ ] Verified email works and any Web3Forms submission reaches the correct inbox.
- [ ] Mobile responsive design and keyboard navigation tested on real browsers/devices.
- [ ] External links, project dialogs, filters, form validation and 404 page tested.
- [ ] Privacy/legal language reviewed for target markets.
- [ ] Cloudflare/hosting domain, indexing, SSL and security headers verified live.
- [ ] Lighthouse, accessibility and performance issues reviewed and resolved.

`npm.cmd run release:report` regenerates the report without modifying SEO settings or deploying anything.