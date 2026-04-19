/**
 * Send a plain-text message from your bot to a user.
 * The user must have started the bot at least once (Telegram requirement).
 */
export async function sendTelegramBotMessage(
  chatId: string,
  text: string,
  options?: { disableWebPagePreview?: boolean }
): Promise<{ ok: true } | { ok: false; description: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) {
    return { ok: false, description: "TELEGRAM_BOT_TOKEN is not configured." };
  }

  /** Default true: Telegram’s link preview can HTTP-fetch URLs and burn one-time tokens (e.g. Supabase recovery). */
  const disableWebPagePreview = options?.disableWebPagePreview !== false;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: disableWebPagePreview,
    }),
  });

  const json = (await res.json()) as { ok?: boolean; description?: string };
  if (!res.ok || json.ok !== true) {
    return {
      ok: false,
      description: json.description ?? `HTTP ${res.status}`,
    };
  }
  return { ok: true };
}
