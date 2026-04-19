begin;

-- Supabase starter / dashboard `profiles` often only has id, full_name, avatar_url, etc.
-- Add columns the EscoBets API expects so PostgREST accepts upserts.
alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists phone text,
  add column if not exists date_of_birth text,
  add column if not exists location text;

alter table public.profiles
  add column if not exists avatar_url text;

commit;
