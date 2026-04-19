import { NextResponse } from "next/server";

/** Public numeric bot id (prefix of the bot token). Safe to expose; used by Telegram.Login.auth. */
export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  const colon = token.indexOf(":");
  const botId = colon > 0 ? token.slice(0, colon) : "";
  if (!/^\d+$/.test(botId)) {
    return NextResponse.json({ error: "invalid_token" }, { status: 500 });
  }
  return NextResponse.json({ botId });
}
