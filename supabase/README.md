# DevNov Supabase setup

1. Create a Supabase project, then run [`schema.sql`](./schema.sql) followed by [`seed.sql`](./seed.sql) in its SQL Editor (or apply them as migrations). The seed is insert-only: it retains administrator edits and adds any missing starter services, technologies, and internal template drafts without updating existing rows.
2. In **Authentication → Users**, create or invite the first owner account. The
   `on_auth_user_created` trigger creates its profile automatically. In the SQL
   Editor, promote that profile to an administrator:

   ```sql
   update public.profiles
   set role = 'admin'
   where id = '<the-auth-user-uuid>';
   ```

3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` locally and in the deployment environment. Never expose a service-role key in a `VITE_` variable. The app also supports the legacy `VITE_SUPABASE_ANON_KEY` for existing projects.

## Project publishing and media

Create a project as a draft first. Upload its screenshot to the private `project-media` bucket at:

```
<project UUID>/<sanitized-file-name>
```

Save that object key (not a storage URL) in `projects.image_path`, give it meaningful `image_alt` text, set a real `https://` `live_url`, and then publish it. The database rejects publishing without a valid HTTPS live URL.

The bucket is intentionally private. The public site must use `supabase.storage.from('project-media').createSignedUrl(image_path, 3600)` when it resolves a project image. Its storage policy allows signed reads only for an image referenced by a published project; administrators can also preview draft media.

Projects, services, technologies, and project/technology links are public-read only when published. Technologies use a required `group` of `core` or `ai`, so the stack marquee can render its two sections from the database. Only `profiles.role = 'admin'` can create, update, or delete them.

## Internal reference templates

`seed.sql` preserves the former local demo concepts as `[Template]` project
drafts. Each is explicitly fictional, unpublished, unfeatured, and has no
image or URL, so public visitors cannot mistake it for client work. The seed
links technologies only when it inserts a template for the first time; a later
seed run never restores fields or links an administrator has changed or
removed. Replace all fictional copy and add verified assets and a real HTTPS
live URL before manually publishing a converted template.
