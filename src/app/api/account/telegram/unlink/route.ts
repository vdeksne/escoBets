import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { readTelegramIdFromUserMetadata } from "@/lib/account/telegram-profile-email";
import type { ApiError, ApiSuccess } from "@/types/api";

type Res = NextResponse<ApiSuccess<{ ok: true }> | ApiError>;

function err(m: string, status: number, code: string): Res {
  return NextResponse.json(
    { success: false, error: { code, message: m } } satisfies ApiError,
    { status }
  );
}

/**
 * Remove Telegram from `user_metadata` (link-via-profile flow). Does not call Supabase
 * `unlinkIdentity` (no separate Telegram OAuth identity in that case).
 */
export async function POST(): Promise<Res> {
  const supabase = await createClient();
  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser();
  if (uErr || !user) {
    return err("Authentication required.", 401, "UNAUTHORIZED");
  }
  if (!readTelegramIdFromUserMetadata(user)) {
    return err("No linked Telegram in profile metadata.", 400, "TELEGRAM_NOT_LINKED");
  }

  const service = createServiceRoleClient();
  if (!service) {
    return err("Service not configured.", 503, "SERVICE_NOT_CONFIGURED");
  }

  const prev = { ...(user.user_metadata ?? {}) } as Record<string, unknown>;
  delete prev.telegram_id;
  delete prev.telegram_username;

  const { error: updErr } = await service.auth.admin.updateUserById(user.id, {
    user_metadata: prev,
  });
  if (updErr) {
    return err(updErr.message, 500, "UPDATE_FAILED");
  }
  const { error: profErr } = await service
    .from("profiles")
    .update({ telegram_id: null })
    .eq("id", user.id);
  if (profErr) {
    console.error("[telegram/unlink] profiles update:", profErr.message);
  }
  return NextResponse.json({ success: true, data: { ok: true } } satisfies ApiSuccess<{ ok: true }>);
}
