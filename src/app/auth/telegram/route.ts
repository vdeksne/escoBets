import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { verifyTelegramWidgetParams } from "@/lib/auth/verify-telegram-widget";

function safeNextPath(raw: string | null): string {
  if (!raw) return "/account";
  if (!raw.startsWith("/")) return "/account";
  if (raw.startsWith("//")) return "/account";
  return raw;
}

function loginRedirect(origin: string, error: string) {
  const u = new URL("/login", origin);
  u.searchParams.set("error", error);
  const res = NextResponse.redirect(u);
  clearTgNextCookie(res);
  return res;
}

const TG_NEXT_COOKIE = "tg_login_next";

function clearTgNextCookie(response: NextResponse) {
  response.cookies.set(TG_NEXT_COOKIE, "", { path: "/", maxAge: 0 });
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const nextFromCookie = request.cookies.get(TG_NEXT_COOKIE)?.value;
  const next = safeNextPath(nextFromCookie ?? url.searchParams.get("next"));
  const origin = url.origin;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!botToken || !serviceKey || !supabaseUrl || !anonKey) {
    return loginRedirect(origin, "telegram_not_configured");
  }

  const verified = verifyTelegramWidgetParams(url.searchParams, botToken);
  if (!verified.ok) {
    return loginRedirect(origin, "telegram_invalid");
  }

  const { id, first_name, last_name, username, photo_url } = verified.data;
  const email = `tg_${id}@telegram.escobets.invalid`;
  const fullName =
    [first_name, last_name].filter(Boolean).join(" ").trim() || first_name || "Telegram user";

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      data: {
        telegram_id: id,
        telegram_username: username ?? null,
        full_name: fullName,
        avatar_url: photo_url ?? null,
      },
    },
  });

  const hashed = linkData?.properties?.hashed_token;
  if (linkError || !hashed) {
    console.error("[auth/telegram] generateLink:", linkError?.message ?? linkError);
    return loginRedirect(origin, "telegram_magiclink_failed");
  }

  const response = NextResponse.redirect(new URL(next, origin));
  clearTgNextCookie(response);
  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error: verifyError } = await supabase.auth.verifyOtp({
    type: "magiclink",
    token_hash: hashed,
  });

  if (verifyError) {
    console.error("[auth/telegram] verifyOtp:", verifyError.message);
    return loginRedirect(origin, "telegram_otp_failed");
  }

  return response;
}
