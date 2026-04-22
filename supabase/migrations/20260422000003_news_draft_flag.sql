-- Draft vs published for news articles (admin /api/admin/news, public /api/news hides drafts)
begin;

alter table public.news
  add column if not exists is_draft boolean not null default false;

commit;
