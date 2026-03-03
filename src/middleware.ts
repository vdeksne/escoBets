import { NextResponse, type NextRequest } from "next/server";

/** Middleware – Supabase auth disabled until backend is set up.
 * To enable: uncomment the Supabase block and add NEXT_PUBLIC_SUPABASE_URL + ANON_KEY */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Supabase auth disabled – re-add when ready (see README)
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
