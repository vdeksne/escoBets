begin;

-- Persistent profit tracker rows (replaces localStorage-only for server-side aggregates + admin list).
create table if not exists public.profit_tracker_entries (
  id text not null primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text,
  amount double precision not null,
  type text not null,
  date date not null,
  created_at timestamptz not null default now(),
  constraint profit_tracker_entries_type_check
    check (type in ('investment', 'profit', 'loss'))
);

create index if not exists profit_tracker_entries_user_id_idx
  on public.profit_tracker_entries (user_id);

alter table public.profit_tracker_entries enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profit_tracker_entries' and policyname = 'profit_tracker_select_own'
  ) then
    create policy profit_tracker_select_own
      on public.profit_tracker_entries
      for select
      using (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profit_tracker_entries' and policyname = 'profit_tracker_insert_own'
  ) then
    create policy profit_tracker_insert_own
      on public.profit_tracker_entries
      for insert
      with check (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profit_tracker_entries' and policyname = 'profit_tracker_update_own'
  ) then
    create policy profit_tracker_update_own
      on public.profit_tracker_entries
      for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profit_tracker_entries' and policyname = 'profit_tracker_delete_own'
  ) then
    create policy profit_tracker_delete_own
      on public.profit_tracker_entries
      for delete
      using (auth.uid() = user_id);
  end if;
end $$;

-- Aggregated P/L per user (admin /api/users reads via service role only).
create or replace view public.profit_tracker_user_totals as
select
  e.user_id,
  coalesce(sum(e.amount) filter (where e.type = 'profit'), 0)::double precision as total_profits,
  coalesce(sum(e.amount) filter (where e.type = 'loss'), 0)::double precision as total_losses
from public.profit_tracker_entries e
group by e.user_id;

revoke all on public.profit_tracker_user_totals from public;
revoke all on public.profit_tracker_user_totals from anon;
revoke all on public.profit_tracker_user_totals from authenticated;
grant select on public.profit_tracker_user_totals to service_role;

commit;
