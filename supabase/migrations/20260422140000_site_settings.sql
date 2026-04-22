-- Site-wide copy and assets for the public home page (managed from /admin/site).

create table if not exists public.site_settings (
  id text primary key default 'default',
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, payload)
  values ('default', '{}'::jsonb)
  on conflict (id) do nothing;

alter table public.site_settings enable row level security;

-- Public can read (home page is anonymous); writes go through API with service role only.
create policy "site_settings_select_anon" on public.site_settings
  for select to anon, authenticated
  using (true);

-- No direct updates from the client; admin route uses the service role key.
