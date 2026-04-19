/** Domain used in `src/app/auth/telegram/route.ts` for synthetic auth emails. */
export const TELEGRAM_PLACEHOLDER_EMAIL_DOMAIN = "telegram.escobets.invalid";

export function isTelegramPlaceholderEmail(email: string | null | undefined): boolean {
  if (!email || typeof email !== "string") return false;
  return email.toLowerCase().endsWith(`@${TELEGRAM_PLACEHOLDER_EMAIL_DOMAIN}`);
}

/** Parses `tg_1239315415@…` → `1239315415`. */
export function telegramPlaceholderNumericId(email: string): string | null {
  const local = email.split("@")[0] ?? "";
  const m = /^tg_(\d+)$/i.exec(local.trim());
  return m ? m[1] : null;
}

export function readTelegramUsernameFromUserMetadata(user: {
  user_metadata?: Record<string, unknown> | null;
}): string | null {
  const v = user.user_metadata?.telegram_username;
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

/** What to show instead of the raw synthetic email. */
export function telegramAccountDisplayLines(params: {
  email: string;
  telegramUsername?: string | null;
}): { primary: string; secondary?: string } {
  if (!isTelegramPlaceholderEmail(params.email)) {
    return { primary: params.email };
  }
  const un = params.telegramUsername?.trim();
  if (un) {
    const handle = un.startsWith("@") ? un : `@${un}`;
    return { primary: handle, secondary: "Telegram" };
  }
  const id = telegramPlaceholderNumericId(params.email);
  if (id) {
    return { primary: "Telegram account", secondary: `ID · ${id}` };
  }
  return { primary: "Telegram account", secondary: params.email };
}
