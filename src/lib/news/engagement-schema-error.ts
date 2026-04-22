/**
 * PostgREST / Supabase error when engagement migrations were never applied to the project DB.
 */
export function isEngagementTablesMissingError(message: string | undefined | null): boolean {
  if (!message) {
    return false;
  }
  const m = message;
  if (!/(news_likes|news_page_views|news_comments|record_news_view|add_news_comment|visitor_id)/i.test(m)) {
    return false;
  }
  return (
    m.includes("schema cache") ||
    /does not exist|could not find the table|relation /i.test(m)
  );
}

/** Shown in API JSON when engagement tables are missing from the linked Supabase project. */
export const ENGAGEMENT_MIGRATION_HINT =
  "Apply news engagement migrations: run `supabase/migrations/20260422120000_news_engagement.sql` (then 2001, 2002) in Supabase Dashboard → SQL, or `npx supabase db push` from the repo. Wait a few seconds for PostgREST to refresh.";
