# DevNov — Social Preview & Search Metadata (M10)

A factual DevNov 1200x630 PNG share card was added at `public/social-card.png`. No invented clients, metrics or testimonials.

**Keep the existing noindex draft mode** until you own a production domain. Do not run the publish command before that.

When your domain is verified and site is ready:

```powershell
cd E:\DevNov
node scripts/publish-complete.mjs https://your-actual-domain.com
npm.cmd run check
npm.cmd run build
```

This reuses the original `scripts/seo.mjs` command to publish robots/canonical/sitemap, then adds `og:image`, Twitter preview and minimal DevNov Organization schema. It is safe to rerun.

For draft-mode after a test, run `node scripts/seo.mjs draft` AND `node scripts/social-seo.mjs` to remove production-only social/structured links.

Verify preview in actual deployed website using external social-card debug tools. SVG favicon and generated social preview artwork are not an official company registration claim.
