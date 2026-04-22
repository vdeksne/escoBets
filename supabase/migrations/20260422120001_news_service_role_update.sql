-- Allow service_role to update engagement counters on public.news.
-- (RLS is enabled on news; service_role normally bypasses RLS, but an explicit
--  policy + GRANT helps in edge cases and documents intent.)
begin;

-- Policy: when the request is made as `service_role`, allow updating rows (bypass
--  is default for this role, but the policy makes intent explicit in SQL).

drop policy if exists "news_update_engagement_service_role" on public.news;
create policy "news_update_engagement_service_role"
  on public.news
  for update
  to service_role
  using (true)
  with check (true);

commit;
