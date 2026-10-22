# DevNov — Redesign Acceptance & Manual QA

## Source of truth
Approved white/orange/charcoal reference screenshot. The redesign never uses that full screenshot as an image or invents clients.

## Automated
`npm.cmd run check` and `node scripts/verify-redesign.mjs` and `npm.cmd run qa:content` and `npm.cmd run build`.

## Browser verification (REQUIRED; not automated by the PowerShell installer)
- Open `http://127.0.0.1:5173` after `npm.cmd run dev`.
- At 1440, 1024, 768, 390 and 320px: verify cards visibly contrast with their backgrounds; no horizontal scrollbar.
- Inspect hero, services, portfolio, why choose, process, team (if published), FAQ, contact and footer.
- Keyboard: Skip link, mobile menu (Escape), FAQ expand, project category filters and case study focus trap.
- All existing project links work and only genuine entries show.
- Publish project screenshots with `npm.cmd run projects:add` and descriptions with consent/ownership clarity.
- Publish team members with `npm.cmd run team:add` only after their permission.
- Check actual Web3Forms delivery, validation, success/error displays with a properly configured access key.
- Use a separate approved monochrome hero image to match the reference portrait exactly. Current hero contains an original abstract product illustration instead.
- Verify exact `DevNov` brand wherever displayed.
- SEO draft state is intentional until real domain and launch signoff.

## Known content readiness
This uploaded ZIP has zero published portfolio entries and zero published team members. Website can build, but photo-rich reference sections cannot fully match without genuine content. The site config email exists but ownership was not independently verified.

## Files deliberately preserved
`src/data/projects.json`, `src/data/team.json`, `.env*`, `public/projects/`, `public/team/`, management CLI, and Web3Forms submit logic.
