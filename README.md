# Devnov - Agency Website (Module 1)

Separate **React + Vite** project created in `E:\DevNov`, matching the new specification. The existing **Next.js** project is not touched.

## Commands (PowerShell)
```powershell
cd E:\DevNov
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$env:USERPROFILE\Downloads\Devnov-Module-01-Setup-E-DevNov.ps1"
npm.cmd install
npm.cmd run verify
npm.cmd run build
npm.cmd run dev
```
Visit `http://127.0.0.1:5173` after running the dev server. A foundation preview is expected, NOT a complete published agency website.

## Add real content
Edit `src/data/agencyData.js` for Devnov branding, services, projects, team and contact. Don't add fake references or metrics. Place approved screenshots under `public/projects/`.

## Status
Only Module 1 is implemented. Reserved section components intentionally return `null`; future modules will replace them.
## Module 02 - Navbar and Hero
The React site now includes a sticky, accessible mobile/desktop navigation, an animated premium hero, a labelled illustrative interface, a clean footer, and anchored capabilities/process previews. Existing static content remains in `src/data/agencyData.js`.

### Run from the E:\DevNov terminal (script stored on D drive)
```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "D:\Downloads\Devnov-Module-02.ps1"
npm.cmd run dev
```
Open `http://127.0.0.1:5173`. The public contact CTA automatically activates after adding a *verified* `agency.email` or HTTPS `agency.calendlyUrl` to the data file. Until then, CTA links point to working on-page sections.

### Verification
```powershell
npm.cmd run verify
node.exe scripts/verify-module2.mjs
npm.cmd run build
```
Automatic backups are saved under `.devnov-backups/` before this module changes any files. Do not upload `.devnov-backups` to a public repository.
## Module 03 - Work and Case Studies
A responsive portfolio is mounted at `#work` with real-data project cards, category filters, and accessible case-study dialogs.
Create your own projects from the terminal by running `npm.cmd run projects:add`; view projects with `npm.cmd run projects:list`.
Manage images from your local drive, and use `npm.cmd run verify:module3` to validate source, project data, and screenshots.
See [PROJECTS-GUIDE.md](PROJECTS-GUIDE.md) for the full project-management workflow.
Only genuine project entries are published; no placeholder client stories or fictitious metrics.

## Modules 04-09
Complete services, process, FAQ, consent-first team, Web3Forms-ready contact, footer, draft-first SEO and release checks. Review TEAM-GUIDE.md, CONTACT-GUIDE.md and DEPLOYMENT-GUIDE.md. Run npm.cmd run check, npm.cmd run audit:site, and npm.cmd run dev.
