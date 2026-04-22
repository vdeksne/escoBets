import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/auth/require-admin";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { createClient } from "@/lib/supabase/server";
import { mergeSiteSettings } from "@/lib/site-settings/merge-payload";

type ErrorBody = { success: false; error: { code: string; message: string } };
function err(status: 400 | 401 | 403 | 500 | 503, code: string, message: string) {
  return NextResponse.json(
    { success: false, error: { code, message } } satisfies ErrorBody,
    { status },
  );
}

export async function GET() {
  const auth = await requireAdminUser();
  if (auth.user === null) {
    return auth.error;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("payload")
    .eq("id", "default")
    .maybeSingle();
  if (error) {
    return err(500, "QUERY_FAILED", error.message);
  }
  return NextResponse.json({
    success: true,
    data: mergeSiteSettings(data?.payload ?? null),
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminUser();
  if (auth.user === null) {
    return auth.error;
  }
  const service = createServiceRoleClient();
  if (!service) {
    return err(503, "SERVICE_NOT_CONFIGURED", "Server could not use the service role. Check SUPABASE_SERVICE_ROLE_KEY.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return err(400, "INVALID_JSON", "Request body must be JSON.");
  }

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return err(400, "INVALID_BODY", "Body must be a JSON object.");
  }

  const merged = mergeSiteSettings(body);

  const { error } = await service.from("site_settings").upsert(
    {
      id: "default",
      payload: merged,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  if (error) {
    return err(500, "SAVE_FAILED", error.message);
  }
  return NextResponse.json({ success: true, data: merged });
}

export async function POST(request: NextRequest) {
  return PATCH(request);
}
