-- DevNov content backend
--
-- Run this file once in the Supabase SQL Editor (or as a migration) before
-- running seed.sql.  The browser must use only the anon/publishable key: RLS
-- below grants write access exclusively to profiles whose role is `admin`.

begin;

create extension if not exists pgcrypto;

do $$
begin
  create type public.app_role as enum ('admin', 'editor');
exception
  when duplicate_object then null;
end
$$;

-- These helpers are deliberately strict.  A published case study must point
-- to a real HTTPS deployment, rather than an unhosted local or placeholder URL.
create or replace function public.is_valid_https_url(value text)
returns boolean
language sql
immutable
parallel safe
as $$
  select value is not null
    and value = btrim(value)
    and value ~* '^https://[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+([:][0-9]{1,5})?([/?#][^[:space:]]*)?$'
$$;

-- Project images are stored under <project UUID>/<sanitized-file-name>.
-- Keeping only the object key in the database means signed URLs never expire
-- in stored content and can be minted at read time.
create or replace function public.is_safe_project_media_path(value text)
returns boolean
language sql
immutable
parallel safe
as $$
  select value is not null
    and value = btrim(value)
    and value ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[A-Za-z0-9][A-Za-z0-9._-]{0,180}$'
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.app_role not null default 'editor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length check (
    display_name is null or char_length(btrim(display_name)) between 1 and 120
  )
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  category text not null default 'Software',
  image_path text,
  image_alt text,
  challenge text,
  solution text,
  outcome text,
  live_url text,
  repository_url text,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null default auth.uid(),
  updated_by uuid references public.profiles(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint projects_title_present check (char_length(btrim(title)) between 1 and 180),
  constraint projects_summary_present check (char_length(btrim(summary)) between 1 and 1000),
  constraint projects_category_present check (char_length(btrim(category)) between 1 and 100),
  constraint projects_sort_order_nonnegative check (sort_order >= 0),
  constraint projects_image_path_is_scoped check (
    image_path is null
    or (
      public.is_safe_project_media_path(image_path)
      and image_path like id::text || '/%'
    )
  ),
  constraint projects_image_alt_present_when_image_exists check (
    image_path is null or char_length(btrim(coalesce(image_alt, ''))) between 1 and 240
  ),
  constraint projects_repository_url_is_https check (
    repository_url is null or public.is_valid_https_url(repository_url)
  ),
  constraint projects_live_url_is_https check (
    live_url is null or public.is_valid_https_url(live_url)
  ),
  constraint projects_published_requires_https_live_url check (
    not published or public.is_valid_https_url(live_url)
  )
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  capabilities text[] not null default '{}',
  icon_key text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint services_title_present check (char_length(btrim(title)) between 1 and 180),
  constraint services_description_present check (char_length(btrim(description)) between 1 and 1000),
  constraint services_sort_order_nonnegative check (sort_order >= 0),
  constraint services_icon_key_format check (icon_key is null or icon_key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint services_capabilities_no_nulls check (array_position(capabilities, null::text) is null)
);

create table if not exists public.technologies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  category text not null,
  "group" text not null default 'core',
  icon_key text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint technologies_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint technologies_label_present check (char_length(btrim(label)) between 1 and 120),
  constraint technologies_category_present check (char_length(btrim(category)) between 1 and 100),
  constraint technologies_group_valid check ("group" in ('core', 'ai')),
  constraint technologies_sort_order_nonnegative check (sort_order >= 0),
  constraint technologies_icon_key_format check (icon_key is null or icon_key ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

-- Keep the schema safe to apply to an early database that was created before
-- the public stack was separated into Core Development and AI & Automation.
alter table public.technologies
  add column if not exists "group" text not null default 'core';

update public.technologies
set "group" = 'core'
where "group" is null;

alter table public.technologies
  alter column "group" set default 'core',
  alter column "group" set not null;

do $$
begin
  alter table public.technologies
    add constraint technologies_group_valid check ("group" in ('core', 'ai'));
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.project_technologies (
  project_id uuid not null references public.projects(id) on delete cascade,
  technology_id uuid not null references public.technologies(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (project_id, technology_id),
  constraint project_technologies_sort_order_nonnegative check (sort_order >= 0)
);

create index if not exists projects_public_listing_idx
  on public.projects (featured desc, sort_order asc, published_at desc nulls last)
  where published;
create index if not exists services_public_listing_idx
  on public.services (sort_order asc, title asc)
  where published;
create index if not exists technologies_public_listing_idx
  on public.technologies (sort_order asc, label asc)
  where published;
create index if not exists project_technologies_technology_idx
  on public.project_technologies (technology_id, sort_order asc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Browser-originated writes cannot forge a different creator/updater.  Service
-- role scripts retain the option to set audit fields for imports/backfills.
create or replace function public.set_project_audit_fields()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() is not null then
    if tg_op = 'INSERT' then
      new.created_by := auth.uid();
    end if;
    new.updated_by := auth.uid();
  end if;
  return new;
end;
$$;

create or replace function public.set_project_published_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.published then
    if tg_op = 'INSERT' or not coalesce(old.published, false) then
      new.published_at := coalesce(new.published_at, now());
    end if;
  else
    new.published_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists projects_set_audit_fields on public.projects;
create trigger projects_set_audit_fields
before insert or update on public.projects
for each row execute function public.set_project_audit_fields();

drop trigger if exists projects_set_published_at on public.projects;
create trigger projects_set_published_at
before insert or update on public.projects
for each row execute function public.set_project_published_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists technologies_set_updated_at on public.technologies;
create trigger technologies_set_updated_at
before update on public.technologies
for each row execute function public.set_updated_at();

-- Every new Supabase Auth user gets a non-privileged profile.  Promote the
-- first owner manually after sign-up; clients can never set their own role.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(
      btrim(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')),
      ''
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- SECURITY DEFINER avoids recursive profile RLS checks.  It exposes only a
-- boolean for the current JWT subject and is safe to call from table/storage
-- policies.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  )
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.technologies enable row level security;
alter table public.project_technologies enable row level security;

drop policy if exists profiles_select_own_or_admin on public.profiles;
create policy profiles_select_own_or_admin
on public.profiles for select to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_admin_manage on public.profiles;
create policy profiles_admin_manage
on public.profiles for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists projects_public_read_published on public.projects;
create policy projects_public_read_published
on public.projects for select to anon, authenticated
using (published or public.is_admin());

drop policy if exists projects_admin_manage on public.projects;
create policy projects_admin_manage
on public.projects for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists services_public_read_published on public.services;
create policy services_public_read_published
on public.services for select to anon, authenticated
using (published or public.is_admin());

drop policy if exists services_admin_manage on public.services;
create policy services_admin_manage
on public.services for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists technologies_public_read_published on public.technologies;
create policy technologies_public_read_published
on public.technologies for select to anon, authenticated
using (published or public.is_admin());

drop policy if exists technologies_admin_manage on public.technologies;
create policy technologies_admin_manage
on public.technologies for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists project_technologies_public_read_published on public.project_technologies;
create policy project_technologies_public_read_published
on public.project_technologies for select to anon, authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.projects as project
    join public.technologies as technology
      on technology.id = project_technologies.technology_id
    where project.id = project_technologies.project_id
      and project.published
      and technology.published
  )
);

drop policy if exists project_technologies_admin_manage on public.project_technologies;
create policy project_technologies_admin_manage
on public.project_technologies for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Explicit grants keep anonymous users read-only; the RLS policies above
-- decide which rows are visible.  Authenticated users receive DML privileges
-- only so that the admin RLS policy can allow their writes.
revoke all on table public.profiles, public.projects, public.services, public.technologies, public.project_technologies from anon;
grant select on table public.projects, public.services, public.technologies, public.project_technologies to anon;
grant select on table public.profiles, public.projects, public.services, public.technologies, public.project_technologies to authenticated;
grant insert, update, delete on table public.profiles, public.projects, public.services, public.technologies, public.project_technologies to authenticated;

-- Private media bucket: published project images are readable by the public
-- through a short-lived signed URL.  Draft media remains visible only to an
-- admin, even if its object path becomes known.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-media',
  'project-media',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists project_media_read_published_or_admin on storage.objects;
create policy project_media_read_published_or_admin
on storage.objects for select to anon, authenticated
using (
  bucket_id = 'project-media'
  and (
    public.is_admin()
    or exists (
      select 1
      from public.projects as project
      where project.published
        and project.image_path = storage.objects.name
    )
  )
);

drop policy if exists project_media_admin_insert on storage.objects;
create policy project_media_admin_insert
on storage.objects for insert to authenticated
with check (
  bucket_id = 'project-media'
  and public.is_admin()
  and public.is_safe_project_media_path(name)
);

drop policy if exists project_media_admin_update on storage.objects;
create policy project_media_admin_update
on storage.objects for update to authenticated
using (bucket_id = 'project-media' and public.is_admin())
with check (
  bucket_id = 'project-media'
  and public.is_admin()
  and public.is_safe_project_media_path(name)
);

drop policy if exists project_media_admin_delete on storage.objects;
create policy project_media_admin_delete
on storage.objects for delete to authenticated
using (bucket_id = 'project-media' and public.is_admin());

commit;
