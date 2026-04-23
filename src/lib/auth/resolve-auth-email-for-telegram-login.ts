import type { SupabaseClient } from "@supabase/supabase-js";
import { TELEGRAM_PLACEHOLDER_EMAIL_DOMAIN } from "@/lib/account/telegram-profile-email";

const placeholder = (e: string) =>
  e.toLowerCase().endsWith(`@${TELEGRAM_PLACEHOLDER_EMAIL_DOMAIN}`);

/**
 * When a user linked Telegram to a real email/OAuth account, `profiles.telegram_id` (or
 * `user_metadata.telegram_id` before backfill) maps the Telegram user id to that account.
 * Otherwise Telegram-only sign-in uses the synthetic `tg_<id>@…` email.
 */
export async function resolveAuthEmailForTelegramLogin(
  admin: SupabaseClient,
  telegramUserId: string
): Promise<string> {
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("telegram_id", telegramUserId)
    .maybeSingle();

  if (profile && typeof (profile as { id?: unknown }).id === "string") {
    const uid = (profile as { id: string }).id;
    const { data, error } = await admin.auth.admin.getUserById(uid);
    if (!error && data.user?.email) return data.user.email;
  }

  let syntheticFallback: string | null = null;
  for (let page = 1; page <= 15; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) break;
    const users = data?.users ?? [];
    for (const u of users) {
      const meta = u.user_metadata as Record<string, unknown> | undefined;
      const tid = meta?.telegram_id;
      const s =
        typeof tid === "number"
          ? String(Math.trunc(tid))
          : typeof tid === "string" && /^\d+$/.test(tid.trim())
            ? tid.trim()
            : null;
      if (s === telegramUserId && u.email) {
        if (!placeholder(u.email)) return u.email;
        syntheticFallback = u.email;
      }
    }
    if (users.length < 200) break;
  }

  if (syntheticFallback) return syntheticFallback;
  return `tg_${telegramUserId}@${TELEGRAM_PLACEHOLDER_EMAIL_DOMAIN}`;
}
