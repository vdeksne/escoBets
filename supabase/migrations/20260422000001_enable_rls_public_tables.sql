-- Fix Supabase "rls_disabled_in_public": enable RLS and add least-privilege policies.
-- - news / updates: public read (SELECT) for anon + authenticated — same as current site/API.
-- - users: RLS on with no client policies — only service_role can read/write; app uses server + service key.

begin;

-- ---------------------------------------------------------------------------
-- public.news
-- ---------------------------------------------------------------------------
do $$
begin
  if to_regclass('public.news') is not null then
    alter table public.news enable row level security;

    if not exists (
      select 1
      from pg_policies
      where schemaname = 'public'
        and tablename = 'news'
        and policyname = 'news_select_public'
    ) then
      create policy news_select_public
        on public.news
        for select
        to anon, authenticated
        using (true);
    end if;
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- public.updates
-- ---------------------------------------------------------------------------
do $$
begin
  if to_regclass('public.updates') is not null then
    alter table public.updates enable row level security;

    if not exists (
      select 1
      from pg_policies
      where schemaname = 'public'
        and tablename = 'updates'
        and policyname = 'updates_select_public'
    ) then
      create policy updates_select_public
        on public.updates
        for select
        to anon, authenticated
        using (true);
    end if;
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- public.users (admin CRM-style table; not auth.users)
-- No policies for anon/authenticated — block direct PostgREST access.
-- Server routes use SUPABASE_SERVICE_ROLE_KEY for SELECT/DELETE.
-- ---------------------------------------------------------------------------
do $$
begin
  if to_regclass('public.users') is not null then
    alter table public.users enable row level security;
  end if;
end
$$;

commit;
