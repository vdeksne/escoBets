import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import type { ApiError, ApiSuccess } from "@/types/api";

type PasswordSignInBody = { identifier?: string; password?: string };

type PasswordSignInResponse = ApiSuccess<{ ok: true }> | ApiError;

function errorResponse(status: number, code: string, message: string): NextResponse<ApiError> {
  return NextResponse.json({ success: false, error: { code, message } }, { status });
}

/** Escape `%`, `_`, `\` so `ILIKE` treats them literally (exact handle match, case-insensitive). */
function escapeIlikeExact(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

export async function POST(request: NextRequest): Promise<NextResponse<PasswordSignInResponse>> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey) {
    return errorResponse(500, "NOT_CONFIGURED", "Supabase URL or anon key is not configured.");
  }
  if (!serviceKey) {
    return errorResponse(
      500,
      "NOT_CONFIGURED",
      "SUPABASE_SERVICE_ROLE_KEY is required for username sign-in.",
    );
  }

  let body: PasswordSignInBody;
  try {
    body = (await request.json()) as PasswordSignInBody;
  } catch {
    return errorResponse(400, "INVALID_JSON", "Invalid JSON body.");
  }

  const identifier = typeof body.identifier === "string" ? body.identifier.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!identifier || !password) {
    return errorResponse(400, "INVALID_INPUT", "Email or username and password are required.");
  }

  let email: string | null = null;

  if (identifier.includes("@")) {
    email = identifier.toLowerCase();
  } else {
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const pattern = escapeIlikeExact(identifier);
    const { data: rows, error: profileError } = await admin
      .from("profiles")
      .select("id")
      .ilike("user_name", pattern)
      .limit(2);

    if (profileError) {
      console.error("[password-sign-in] profiles:", profileError.message);
      return errorResponse(401, "INVALID_CREDENTIALS", "Invalid email or password.");
    }

    if (!rows?.length) {
      return errorResponse(401, "INVALID_CREDENTIALS", "Invalid email or password.");
    }
    if (rows.length > 1) {
      return errorResponse(401, "INVALID_CREDENTIALS", "Invalid email or password.");
    }

    const { data: authUser, error: getUserError } = await admin.auth.admin.getUserById(rows[0].id);
    if (getUserError || !authUser.user?.email) {
      return errorResponse(401, "INVALID_CREDENTIALS", "Invalid email or password.");
    }
    email = authUser.user.email;
  }

  const response = NextResponse.json({
    success: true as const,
    data: { ok: true as const },
  } satisfies PasswordSignInResponse);

  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options as CookieOptions);
        });
      },
    },
  });

  const { error: signError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signError) {
    return errorResponse(401, "INVALID_CREDENTIALS", "Invalid email or password.");
  }

  return response;
}
