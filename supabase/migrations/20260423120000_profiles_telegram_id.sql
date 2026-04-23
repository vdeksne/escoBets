-- Maps Telegram user id → auth user for "Continue with Telegram" after linking
-- from a real email / OAuth account (see src/app/auth/telegram/route.ts).
begin;

alter table public.profiles
  add column if not exists telegram_id text;

create unique index if not exists profiles_telegram_id_key
  on public.profiles (telegram_id)
  where telegram_id is not null;

commit;
