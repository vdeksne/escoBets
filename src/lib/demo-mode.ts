/**
 * Demo / static deploy mode (see ESCOBETS_DEMO_BUILD / NEXT_PUBLIC_DEMO_MODE):
 * - Skips Supabase in middleware, site settings DB, client auth, and protected-route DB reads.
 * - Skips X API on the home page (manual cards only).
 * - News list & article APIs use MOCK_NEWS_ARTICLES only; engagement returns static mode (no DB).
 * Flip off when the backend is live again.
 */
export const ESCOBETS_DEMO_BUILD = true;

export function isDemoMode(): boolean {
  const off =
    process.env.NEXT_PUBLIC_DEMO_MODE === "false" ||
    process.env.NEXT_PUBLIC_DEMO_MODE === "0" ||
    process.env.DEMO_MODE === "false" ||
    process.env.DEMO_MODE === "0";
  if (off) return false;

  const on =
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
    process.env.NEXT_PUBLIC_DEMO_MODE === "1" ||
    process.env.DEMO_MODE === "true" ||
    process.env.DEMO_MODE === "1";
  if (on) return true;

  return ESCOBETS_DEMO_BUILD;
}

/** Inlined for client bundles (same rules as `isDemoMode`). */
export const isDemoModeClient = (() => {
  const off =
    process.env.NEXT_PUBLIC_DEMO_MODE === "false" || process.env.NEXT_PUBLIC_DEMO_MODE === "0";
  if (off) return false;
  const on =
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "1";
  if (on) return true;
  return ESCOBETS_DEMO_BUILD;
})();
