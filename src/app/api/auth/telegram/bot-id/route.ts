import { NextResponse } from "next/server";

/** Public numeric bot id (prefix of the bot token). Safe to expose; used by Telegram.Login.auth. */
export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) {
    // 200 avoids noisy browser console "503" on every load; client checks `ok`.
    return NextResponse.json(
      { ok: false as const, code: "telegram_token_missing" },
      { status: 200 },
    );
  }
  const colon = token.indexOf(":");
  const botId = colon > 0 ? token.slice(0, colon) : "";
  if (!/^\d+$/.test(botId)) {
    return NextResponse.json({ ok: false as const, code: "invalid_token" }, { status: 500 });
  }
  return NextResponse.json({ ok: true as const, botId });
}
