-- Dossier entries. Date is the spine; index numbers are computed at render.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  occurred_on date not null,
  client text,
  role text,
  summary text,
  tags text[] not null default '{}',
  accent text not null default '#111111',
  specs jsonb not null default '{}'::jsonb,
  cover_path text not null default '',
  blocks jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_occurred_on_idx on public.projects (occurred_on);

alter table public.projects enable row level security;

drop policy if exists "public read published" on public.projects;
create policy "public read published"
  on public.projects
  for select
  using (published = true);

drop policy if exists "authenticated manage" on public.projects;
create policy "authenticated manage"
  on public.projects
  for all
  to authenticated
  using (true)
  with check (true);

insert into storage.buckets (id, name, public)
values ('projects', 'projects', true)
on conflict (id) do nothing;

drop policy if exists "public read project images" on storage.objects;
create policy "public read project images"
  on storage.objects
  for select
  using (bucket_id = 'projects');

drop policy if exists "authenticated write project images" on storage.objects;
create policy "authenticated write project images"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'projects')
  with check (bucket_id = 'projects');
