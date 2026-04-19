/**
 * Send a plain-text message from your bot to a user.
 * The user must have started the bot at least once (Telegram requirement).
 */
export async function sendTelegramBotMessage(
  chatId: string,
  text: string
): Promise<{ ok: true } | { ok: false; description: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) {
    return { ok: false, description: "TELEGRAM_BOT_TOKEN is not configured." };
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: false,
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
