import { randomUUID } from "crypto";
import type { NextRequest, NextResponse } from "next/server";

const VISITOR_COOKIE = "escobets_vid";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const COOKIE_OPTS = {
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 400,
  secure: process.env.NODE_ENV === "production",
};

/**
 * Read an existing httpOnly visitor cookie, or issue a new id (set cookie on the response in apply).
 */
export function getVisitorIdForRequest(request: NextRequest): { id: string; isNew: boolean } {
  const v = request.cookies.get(VISITOR_COOKIE)?.value?.trim() ?? "";
  if (v && UUID_RE.test(v)) {
    return { id: v, isNew: false };
  }
  return { id: randomUUID(), isNew: true };
}

export function applyVisitorCookie(
  response: NextResponse,
  id: string,
  isNew: boolean
) {
  if (!isNew) {
    return;
  }
  response.cookies.set(VISITOR_COOKIE, id, COOKIE_OPTS);
}
