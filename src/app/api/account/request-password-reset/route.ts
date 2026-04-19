import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  isTelegramPlaceholderEmail,
  readTelegramIdFromUserMetadata,
  telegramPlaceholderNumericId,
} from "@/lib/account/telegram-profile-email";
import { sendTelegramBotMessage } from "@/lib/telegram/send-bot-message";
import type { ApiError, ApiSuccess } from "@/types/api";

export type RequestPasswordResetResult = {
  emailSent: boolean;
  telegramSent: boolean;
  telegramDetail?: string;
  supportXUrl: string | null;
};

type ResponseBody = ApiSuccess<RequestPasswordResetResult> | ApiError;

function errorResponse(
  status: number,
  code: string,
  message: string,
  details?: unknown
): NextResponse<ApiError> {
  return NextResponse.json({ success: false, error: { code, message, details } }, { status });
}

function pickActionLink(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const props = (data as { properties?: unknown }).properties;
  if (!props || typeof props !== "object") return null;
  const link = (props as { action_link?: unknown }).action_link;
  return typeof link === "string" && link.startsWith("http") ? link : null;
}

/**
 * Signed-in users only. **Supabase-first** recovery:
 * - Real inbox: `resetPasswordForEmail` (Supabase sends the reset link — configure Auth → SMTP in the dashboard).
 * - Optional: same recovery link via Telegram when we know the user’s Telegram id (needs service role).
 */
export async function POST(request: NextRequest): Promise<NextResponse<ResponseBody>> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !anonKey) {
    return errorResponse(500, "NOT_CONFIGURED", "Supabase is not configured.");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.email) {
    return errorResponse(401, "UNAUTHORIZED", "You must be signed in.");
  }

  const email = user.email;
  const origin = new URL(request.url).origin;
  const resetUrl = `${origin}/reset-password`;
  const supportXUrl = (process.env.NEXT_PUBLIC_SUPPORT_X_URL ?? "").trim() || null;

  const synthetic = isTelegramPlaceholderEmail(email);

  let emailSent = false;
  let telegramSent = false;
  let telegramDetail: string | undefined;

  const anon = createServiceClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  if (!synthetic) {
    const { error: resetErr } = await anon.auth.resetPasswordForEmail(email, { redirectTo: resetUrl });
    if (resetErr) {
      console.error("[request-password-reset] resetPasswordForEmail:", resetErr.message);
    } else {
      emailSent = true;
    }
  }

  const chatId =
    readTelegramIdFromUserMetadata(user) ?? (synthetic ? telegramPlaceholderNumericId(email) : null);

  if (chatId && serviceKey) {
    const admin = createServiceClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
    });
    const actionLink = pickActionLink(linkData);
    if (linkError || !actionLink) {
      telegramDetail = linkError?.message ?? "Could not create recovery link.";
      console.error("[request-password-reset] generateLink:", linkError?.message);
    } else {
      const text = [
        "EscoBets — password reset",
        "",
        "Open this link to choose a new password:",
        actionLink,
        "",
        "If you did not request this, ignore this message.",
      ].join("\n");
      const tg = await sendTelegramBotMessage(chatId, text);
      if (!tg.ok) {
        telegramDetail = tg.description;
        console.error("[request-password-reset] Telegram:", tg.description);
      } else {
        telegramSent = true;
      }
    }
  } else if (chatId && !serviceKey) {
    telegramDetail = "Telegram delivery needs SUPABASE_SERVICE_ROLE_KEY on the server.";
  }

  if (!emailSent && !telegramSent) {
    return errorResponse(
      422,
      "NO_CHANNEL",
      synthetic
        ? "This account has no personal email. We could not send a reset link by Telegram — open your bot in Telegram and ensure SUPABASE_SERVICE_ROLE_KEY is set, or use Telegram login again."
        : "We could not send a reset email. In Supabase: Authentication → Emails / SMTP, enable and configure outbound mail, and add this site URL to redirect allow-list for recovery links.",
      { supportXUrl },
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      emailSent,
      telegramSent,
      ...(telegramDetail ? { telegramDetail } : {}),
      supportXUrl,
    },
  });
}
