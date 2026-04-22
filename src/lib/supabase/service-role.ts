import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Read `role` from a Supabase API JWT (no signature verify — for config checks only).
 * service_role: full DB access. anon: public key — cannot UPDATE `news` or write `news_likes` under RLS.
 */
export function getRoleFromSupabaseKey(key: string | undefined): string | null {
  if (!key || typeof key !== "string" || !key.includes(".")) {
    return null;
  }
  try {
    const b64 = key.split(".")[1]?.replace(/-/g, "+").replace(/_/g, "/") ?? "";
    if (!b64) {
      return null;
    }
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const json = JSON.parse(
      typeof Buffer !== "undefined"
        ? Buffer.from(padded, "base64").toString("utf8")
        : atob(padded)
    ) as { role?: string };
    return typeof json.role === "string" ? json.role : null;
  } catch {
    return null;
  }
}

/**
 * True only when the env var is the service_role secret (not the anon "public" key).
 */
export function isServiceRoleKey(key: string | undefined): boolean {
  return getRoleFromSupabaseKey(key) === "service_role";
}

/** Server-only Supabase client with the service role key (bypasses Storage RLS). */
export function createServiceRoleClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return null;
  }
  if (process.env.NODE_ENV === "development") {
    const r = getRoleFromSupabaseKey(key);
    if (r && r !== "service_role") {
      // eslint-disable-next-line no-console
      console.error(
        `[EscoBets] SUPABASE_SERVICE_ROLE_KEY has role "${r}". Use the service_role secret from Supabase (Project → Settings → API), not the anon public key, or RLS will block news engagement writes.`
      );
    }
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
