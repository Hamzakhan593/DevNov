# DevNov — Advanced Preflight (M12)

Run:

```powershell
cd E:\DevNov
npm.cmd run check
node scripts/audit-assets-advanced.mjs
node scripts/release-preflight.mjs
```

Generates `DEVNOV-ADVANCED-PREFLIGHT.md` with PASS / PENDING / BLOCKER.

**PENDING is not a passed item.** It can include projects, consented team details, real domain indexing, contact email owner verification and social previews. Automated scripts cannot verify actual email delivery, live CDN caching, accessibility or reference image similarity.

Do not deploy until real content, business contact, secure form config (if used), routes, hosting HTTPS, and real browser reviews have been approved. Existing `npm.cmd run release:prepare` remains unchanged.
