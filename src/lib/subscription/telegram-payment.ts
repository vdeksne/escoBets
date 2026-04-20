/**
 * Placeholder hooks for **Telegram Bot Payments** (`sendInvoice`, `answerPreCheckoutQuery`, etc.).
 * Telegram still requires a **payment provider token** from a PSP — see
 * https://core.telegram.org/bots/payments
 *
 * Future server flow (sketch):
 * 1. Authenticated user hits `POST /api/subscription/telegram-invoice` with `{ plan }`.
 * 2. Server uses `TELEGRAM_BOT_TOKEN` + provider token, sends `sendInvoice` to the user’s chat_id.
 * 3. Webhook `pre_checkout_query` / `successful_payment` grants access + redirects to confirmation.
 *
 * `NEXT_PUBLIC_SUBSCRIPTION_TELEGRAM_PAY_BOT_USERNAME` — bot username **without** `@`; used only
 * for a **non-payment** “open bot” deep link until invoices are implemented.
 */
export function getTelegramSubscriptionPayBotUrl(plan: "monthly" | "annual"): string | null {
  const raw = process.env.NEXT_PUBLIC_SUBSCRIPTION_TELEGRAM_PAY_BOT_USERNAME?.trim();
  if (!raw) return null;
  const username = raw.replace(/^@/, "");
  if (!/^[a-zA-Z][a-zA-Z0-9_]{3,30}$/.test(username)) return null;
  return `https://t.me/${username}?start=sub_${plan}`;
}

export const TELEGRAM_PAYMENTS_DOCS_URL = "https://core.telegram.org/bots/payments";
