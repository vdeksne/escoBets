import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { verifyTelegramWidgetParams } from "@/lib/auth/verify-telegram-widget";
import {
  isEscobetsStorageAvatarUrl,
  readTelegramIdFromUserMetadata,
} from "@/lib/account/telegram-profile-email";

/**
 * Link Telegram to the *current* session user (metadata `telegram_id` / `telegram_username`),
 * without creating a separate magic-link `tg_*@` account.
 * Redirect target from `TelegramLoginWidget` with `variant="link"`.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const origin = url.origin;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const service = createServiceRoleClient();
  if (!botToken || !service) {
    return NextResponse.redirect(
      new URL("/account?telegram=error&reason=not_configured", origin)
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.redirect(new URL("/login?error=telegram_link_sign_in", origin));
  }

  const verified = verifyTelegramWidgetParams(url.searchParams, botToken);
  if (!verified.ok) {
    return NextResponse.redirect(new URL("/account?telegram=error&reason=invalid", origin));
  }

  const { id, username, photo_url } = verified.data;
  const idNum = Number(id);
  if (!Number.isFinite(idNum)) {
    return NextResponse.redirect(new URL("/account?telegram=error&reason=invalid", origin));
  }

  const existing = readTelegramIdFromUserMetadata(user);
  if (existing === String(idNum)) {
    return NextResponse.redirect(new URL("/account?telegram=already", origin));
  }
  if (existing && existing !== String(idNum)) {
    return NextResponse.redirect(
      new URL("/account?telegram=error&reason=other_telegram", origin)
    );
  }

  const prev = (user.user_metadata ?? {}) as Record<string, unknown>;
  const nextMeta: Record<string, unknown> = {
    ...prev,
    telegram_id: idNum,
    telegram_username: username ?? null,
  };
  if (typeof photo_url === "string" && photo_url) {
    const existing =
      typeof prev.avatar_url === "string" && prev.avatar_url ? prev.avatar_url : "";
    if (!isEscobetsStorageAvatarUrl(existing)) {
      nextMeta.avatar_url = photo_url;
    }
  }

  const { error: updErr } = await service.auth.admin.updateUserById(user.id, {
    user_metadata: nextMeta,
  });

  if (updErr) {
    return NextResponse.redirect(
      new URL(
        "/account?telegram=error&reason=update",
        origin
      )
    );
  }

  const tgKey = String(id);
  const { error: clearErr } = await service
    .from("profiles")
    .update({ telegram_id: null })
    .eq("telegram_id", tgKey)
    .neq("id", user.id);
  if (clearErr) {
    console.error("[auth/telegram-link] profiles clear other telegram_id:", clearErr.message);
  }
  const { error: profErr } = await service.from("profiles").upsert(
    { id: user.id, telegram_id: tgKey },
    { onConflict: "id" }
  );
  if (profErr) {
    console.error("[auth/telegram-link] profiles upsert:", profErr.message);
  }

  return NextResponse.redirect(new URL("/account?telegram=linked", origin));
}
