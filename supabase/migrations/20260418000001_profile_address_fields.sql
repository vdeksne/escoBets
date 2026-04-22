begin;

-- Structured postal address (ISO-style line components). Keeps legacy `location` for backfill only.
alter table public.profiles
  add column if not exists address_country text,
  add column if not exists address_city text,
  add column if not exists address_street text,
  add column if not exists address_apartment text,
  add column if not exists address_postcode text;

-- One-time: copy old single-line location into street when structured fields are empty
update public.profiles
set address_street = location
where coalesce(nullif(trim(address_street), ''), null) is null
  and location is not null
  and trim(location) <> '';

commit;
