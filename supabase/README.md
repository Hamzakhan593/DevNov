# DevNov Supabase setup

1. Create a Supabase project, then run [`schema.sql`](./schema.sql) followed by [`seed.sql`](./seed.sql) in its SQL Editor (or apply them as migrations).
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
