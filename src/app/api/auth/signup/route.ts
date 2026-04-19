import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validatePasswordStrength } from "@/lib/account/password-policy";
import type { ApiError, ApiSuccess } from "@/types/api";

interface SignupPayload {
  email: string;
  password: string;
  username?: string;
}

interface SignupResult {
  message: string;
}

type SignupResponse = ApiSuccess<SignupResult> | ApiError;

function errorResponse(
  status: number,
  code: string,
  message: string,
  details?: unknown
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, details },
    },
    { status }
  );
}

function successResponse(data: SignupResult): NextResponse<ApiSuccess<SignupResult>> {
  return NextResponse.json({
    success: true,
    data,
  });
}

export async function POST(request: NextRequest): Promise<NextResponse<SignupResponse>> {
  let payload: SignupPayload;

  try {
    payload = (await request.json()) as SignupPayload;
  } catch {
    return errorResponse(400, "INVALID_JSON", "Invalid JSON body.");
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const password = typeof payload.password === "string" ? payload.password.trim() : "";
  const username = typeof payload.username === "string" ? payload.username.trim() : "";

  if (!email || !password) {
    return errorResponse(400, "INVALID_INPUT", "`email` and `password` are required.");
  }

  const strength = validatePasswordStrength(password);
  if (!strength.ok) {
    return errorResponse(400, "WEAK_PASSWORD", strength.message);
  }

  const origin = new URL(request.url).origin;
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: username ? { username } : undefined,
      emailRedirectTo: `${origin}/login`,
    },
  });

  if (error) {
    return errorResponse(400, "SIGNUP_FAILED", error.message);
  }

  return successResponse({
    message: "Signup successful. Check your email to confirm your account before logging in.",
  });
}

