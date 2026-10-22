# DevNov — M13 Preview Content Pack

This is a **local presentation preview**, not published agency proof.

## What is added
- 12 fictional portfolio concept cards, each with an original locally generated UI mockup.
- Four illustrated example team cards (not real people).
- Six extra *service offerings* added to the existing six, for 12 total services.
- Demo visuals display only when the real managed portfolio or real team list for that section is empty.
- Clearly visible DEMO labels in project cards, previews, and team area.

## Where data lives
- Demo records: `src/data/demoContent.js`.
- Demo project pictures: `public/projects/demo-*.png`.
- Demo team illustrations: `public/team/demo-profile-*.png`.
- Actual data (unchanged): `src/data/projects.json` and `src/data/team.json`.
- Services data: `src/data/agencyData.js`.

## Adding genuine content later
- Run `node scripts/content-studio.mjs` if M08 is installed.
- Or use `npm.cmd run projects:add` / `npm.cmd run team:add`.
- As soon as the corresponding managed section contains published genuine records, demo entries disappear from that section automatically.
- To hide *all* demo content beforehand, set `demoEnabled = false` in `src/data/demoContent.js` and rebuild.
- Remove demo images when no longer needed.

**IMPORTANT**: Do not deploy demo people/project screenshots as client achievements. Disable the preview before a production release. Use real, consented details and only actual approved pictures and working links.

Script: `DevNov-Demo-Content-M13.ps1`, `-Action Install|Status`; creates backups in `_devnov_backups` and performs npm checks.
