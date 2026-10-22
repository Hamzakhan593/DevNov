# Devnov | Adding and Publishing Projects (Module 03)

This website is **static**. Case studies are stored on disk, built into the website, and published by deploying the rebuilt `dist/` output. There is no online admin panel or database.

## 1. Add your first real project

Open the VS Code terminal at `E:\DevNov`, then run:

```powershell
npm.cmd run projects:add
```

Answer the questions for project title, real summary, category, technologies, problem, solution, verifiable outcome, live demo URL, repository URL, and screenshot. Press Enter to skip any optional field.

To attach an image, provide its real full path, e.g. `D:\Downloads\agro-vision.webp`. The helper copies this image into `E:\DevNov\public\projects` automatically and saves a static record in `E:\DevNov\src\data\projects.json`. PNG, JPG, WebP and AVIF up to 8 MB are accepted. Optimize large images beforehand.

**No screenshot?** The project appears with an honest, non-deceptive placeholder. **No verified URL?** The corresponding link will not be shown.

## 2. List, hide, publish or remove projects

```powershell
npm.cmd run projects:list
npm.cmd run projects:unpublish
npm.cmd run projects:publish
npm.cmd run projects:remove
```

The helpers request the project slug (shown by `projects:list`). When removing an entry, image files are left on disk to avoid accidental data loss.

You may edit `src/data/projects.json` directly for advanced changes. Follow JSON syntax, keep unique slugs, and set `published: false` to hide a draft. Only publish claims and projects you own or are permitted to showcase.

Existing manually added projects in `src/data/agencyData.js` remain supported. Do not use the same slug in both sources; the managed data source takes priority in rendering, and verification will reject duplicate slugs.

## 3. Preview and publish

```powershell
npm.cmd run projects:list
npm.cmd run check
node.exe scripts/verify-module2.mjs
node.exe scripts/verify-module3.mjs
npm.cmd run build
npm.cmd run dev
```

Visit `http://127.0.0.1:5173/#work`, open a project card, and inspect its accessible case-study dialog. You can filter projects by category and click live demo/source links only when supplied.

To make changes public on hosting, **rebuild and redeploy** `dist/`. Files edited locally do not automatically change an already deployed website.

## 4. Visual style

Dark SaaS with clear differentiation: the work section is `#0B1321`, raised cards are `#192538`, and real screenshots appear on spacious 16:9 canvases. Mobile cards stack in one column. No fake client metrics, reviews or invented outcomes.

## 5. Safety

The Module 03 installer stores modified-file backups under `E:\DevNov\.devnov-backups\module-03-*`. Never publicly deploy the backups. Existing project records and screenshots are preserved. The setup script stops on missing/incorrect prior modules or failing baseline checks.