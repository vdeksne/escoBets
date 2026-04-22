-- Track who created a comment (same anonymous cookie as news likes) so they may delete it later.
-- Legacy rows may have NULL visitor_id (admin-only delete).
begin;

alter table public.news_comments
  add column if not exists visitor_id text;

create index if not exists news_comments_article_visitor_id_idx
  on public.news_comments (article_id, visitor_id)
  where visitor_id is not null;

commit;
