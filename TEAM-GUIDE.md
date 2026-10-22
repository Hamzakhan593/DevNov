# Devnov team profiles

Run `npm.cmd run team:add` to create a profile, `npm.cmd run team:list` to inspect current records, and `npm.cmd run team:publish` / `team:unpublish` / `team:remove` for changes. The commands run in your `E:\DevNov` project terminal. Profiles are saved in `src/data/team.json`; images are copied to `public/team/`.

Only publish a person's name, photo and bio with their permission. New records are **drafts by default**, and the Team section stays hidden until at least one approved profile is published. You may also maintain `team` manually inside `src/data/agencyData.js`. Keep profile IDs unique between the two sources.

After a change, run `npm.cmd run check` and redeploy the `dist/` build. This is a static content workflow; it is **not** an online editable admin dashboard.