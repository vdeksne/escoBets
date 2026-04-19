import { createHash, createHmac } from "node:crypto";

export type TelegramWidgetAuth = {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

/**
 * Validates Telegram Login Widget redirect query params per
 * https://core.telegram.org/widgets/login#checking-authorization
 */
export function verifyTelegramWidgetParams(
  params: URLSearchParams,
  botToken: string
): { ok: true; data: TelegramWidgetAuth } | { ok: false } {
  const hash = params.get("hash");
  if (!hash) return { ok: false };

  const authDateRaw = params.get("auth_date");
  const authDate = authDateRaw ? Number.parseInt(authDateRaw, 10) : NaN;
  if (!Number.isFinite(authDate)) return { ok: false };
  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - authDate) > 86400) return { ok: false };

  /** Per Telegram: all received fields except `hash`, sorted; skip app-only params like `next`. */
  const skip = new Set(["hash", "next"]);
  const keys = [...new Set([...params.keys()])]
    .filter((k) => !skip.has(k))
    .sort((a, b) => a.localeCompare(b));
  const dataCheckString = keys
    .map((k) => {
      const v = params.get(k);
      if (v === null) return null;
      return `${k}=${v}`;
    })
    .filter((line): line is string => line !== null)
    .join("\n");

  const secretKey = createHash("sha256").update(botToken).digest();
  const hmac = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  if (hmac !== hash) return { ok: false };

  const id = params.get("id");
  if (!id) return { ok: false };

  return {
    ok: true,
    data: {
      id,
      first_name: params.get("first_name") ?? "",
      last_name: params.get("last_name") ?? undefined,
      username: params.get("username") ?? undefined,
      photo_url: params.get("photo_url") ?? undefined,
    },
  };
}
