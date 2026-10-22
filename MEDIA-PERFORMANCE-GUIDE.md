# DevNov — Content & Media Audit (M11)

Run after adding project screenshots or team portraits:

```powershell
cd E:\DevNov
node scripts/audit-assets-advanced.mjs
```

Checks published project/team paths, missing media, image signatures, large images, duplicates, HTTPS external URLs, consent and core static assets. Warns about missing genuine content rather than inserting samples.

Recommended screenshots: 16:10 or 16:9, optimized WebP / AVIF, ideally under 500 KB when visually acceptable. Portraits: optimized WebP / JPEG. Before launch also visually inspect keyboard navigation, color contrast and content on 320, 390, 768, 1024 and 1440 pixel viewports.

The audit is source-level: it does NOT prove Lighthouse, WCAG or real browser appearance.
