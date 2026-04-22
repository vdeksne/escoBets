-- Real engagement: per-visitor view dedupe, likes, and comments. API uses service role.
--
-- APPLY TO YOUR SUPABASE PROJECT (required for /api/news/.../like, engagement, comments):
--   • Dashboard → SQL Editor → paste this whole file → Run; then run 20260422120001_* if not yet applied.
--   • Or CLI from repo: `npx supabase link` then `npx supabase db push`
-- If you see "Could not find the table public.news_likes in the schema cache", this file was not run on that project.
--
begin;

-- ---------------------------------------------------------------------------
-- news_page_views: one row per (article, visitor) so view count is idempotent
-- ---------------------------------------------------------------------------
create table if not exists public.news_page_views (
  article_id text not null references public.news (id) on delete cascade,
  visitor_id text not null,
  first_seen timestamptz not null default now(),
  primary key (article_id, visitor_id)
);

create index if not exists news_page_views_article_id_idx
  on public.news_page_views (article_id);

-- ---------------------------------------------------------------------------
-- news_likes: one like per (article, visitor)
-- ---------------------------------------------------------------------------
create table if not exists public.news_likes (
  article_id text not null references public.news (id) on delete cascade,
  visitor_id text not null,
  created_at timestamptz not null default now(),
  primary key (article_id, visitor_id)
);

create index if not exists news_likes_article_id_idx on public.news_likes (article_id);

-- ---------------------------------------------------------------------------
-- news_comments: public-sourced comments
-- ---------------------------------------------------------------------------
create table if not exists public.news_comments (
  id uuid primary key default gen_random_uuid(),
  article_id text not null references public.news (id) on delete cascade,
  body text not null
    check (char_length(body) > 0 and char_length(body) <= 2000),
  author text
    check (author is null or char_length(author) <= 80),
  created_at timestamptz not null default now()
);

create index if not exists news_comments_article_created_idx
  on public.news_comments (article_id, created_at desc);

-- ---------------------------------------------------------------------------
-- RLS: block direct table access; app uses service role only
-- ---------------------------------------------------------------------------
alter table public.news_page_views enable row level security;
alter table public.news_likes enable row level security;
alter table public.news_comments enable row level security;

-- ---------------------------------------------------------------------------
-- record_news_view: idempotent, bumps news.views on first (article, visitor)
-- ---------------------------------------------------------------------------
create or replace function public.record_news_view(p_article_id text, p_visitor_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.news_page_views (article_id, visitor_id)
  values (p_article_id, p_visitor_id);
  update public.news
  set views = coalesce(views, 0) + 1
  where id = p_article_id;
exception
  when unique_violation then
    null; -- already counted
end;
$$;

-- ---------------------------------------------------------------------------
-- toggle_news_like: flips like for visitor; returns (new_likes, is_liked)
-- ---------------------------------------------------------------------------
create or replace function public.toggle_news_like(p_article_id text, p_visitor_id text)
returns table (new_likes int, is_liked boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  had boolean;
  n int;
begin
  select exists(
    select 1 from public.news_likes
    where article_id = p_article_id and visitor_id = p_visitor_id
  )
  into had;

  if had then
    delete from public.news_likes
    where article_id = p_article_id and visitor_id = p_visitor_id;
    update public.news
    set likes = greatest(coalesce(likes, 0) - 1, 0)
    where id = p_article_id
    returning coalesce(likes, 0) into n;
    return query select n, false;
  else
    insert into public.news_likes (article_id, visitor_id) values (p_article_id, p_visitor_id);
    update public.news
    set likes = coalesce(likes, 0) + 1
    where id = p_article_id
    returning coalesce(likes, 0) into n;
    return query select n, true;
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- add_news_comment: insert + increment comment count
-- ---------------------------------------------------------------------------
create or replace function public.add_news_comment(
  p_article_id text,
  p_body text,
  p_author text
)
returns table (c_id uuid, c_created timestamptz, new_total int)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_ts timestamptz;
  v_tot int;
begin
  insert into public.news_comments (article_id, body, author)
  values (p_article_id, p_body, nullif(trim(p_author), ''))
  returning id, created_at
  into v_id, v_ts;

  update public.news
  set comments = coalesce(comments, 0) + 1
  where public.news.id = p_article_id
  returning coalesce(comments, 0) into v_tot;

  return query select v_id, v_ts, v_tot;
end;
$$;

-- Lock down: only service_role may execute (PUBLIC = all roles)
revoke all on function public.record_news_view(text, text) from public;
revoke all on function public.toggle_news_like(text, text) from public;
revoke all on function public.add_news_comment(text, text, text) from public;

grant execute on function public.record_news_view(text, text) to service_role;
grant execute on function public.toggle_news_like(text, text) to service_role;
grant execute on function public.add_news_comment(text, text, text) to service_role;

commit;
