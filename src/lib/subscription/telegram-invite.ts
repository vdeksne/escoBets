/**
 * Private Telegram invite shown after successful subscription checkout.
 * Set `NEXT_PUBLIC_SUBSCRIPTION_TELEGRAM_INVITE_URL` in production if the link changes.
 */
export const SUBSCRIPTION_TELEGRAM_INVITE_URL =
  process.env.NEXT_PUBLIC_SUBSCRIPTION_TELEGRAM_INVITE_URL?.trim() ||
  "https://t.me/+2RiZCk6AN_5jMDY0";
