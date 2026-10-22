# DevNov — Local Content Studio (M08)

## Start the owner-only editor

From PowerShell (after installation):

```powershell
cd E:\DevNov
node scripts/content-studio.mjs
```

Choose Add Project / Edit Project, or Add Team / Edit Team. Add flow delegates to existing project/team managers, and editing safely backs up JSON under `_devnov_backups/content-studio`.

Content is stored in `src/data/projects.json` and `src/data/team.json` and published by rebuilding/redeploying the static site. This is a local editor and creates **no public admin login or server**.

Only publish owned/approved real work, verified outcomes, and consented team information. For photos, paste an actual Windows path like `D:\Pictures\my-app.webp`. Do not publish confidential content.

Quick status: `node scripts/content-studio.mjs status`

After changes: `npm.cmd run check` then `npm.cmd run dev` to preview.
