import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/account";
import { EMPTY_PROFILE_ADDRESS } from "@/types/account";

/** Stable id for demo session (matches `getDemoSupabaseUser`). */
export const DEMO_USER_ID = "00000000-0000-4000-8000-000000000001";

/** Fake Supabase user: admin + signed-in for API guards in demo mode. */
export function getDemoSupabaseUser(): User {
  const now = new Date().toISOString();
  return {
    id: DEMO_USER_ID,
    aud: "authenticated",
    role: "authenticated",
    email: "demo@escobets.com",
    email_confirmed_at: now,
    phone: "",
    confirmed_at: now,
    last_sign_in_at: now,
    app_metadata: { role: "admin", provider: "demo" },
    user_metadata: {},
    identities: [],
    created_at: now,
    updated_at: now,
    is_anonymous: false,
  } as User;
}

/** Profile payload returned by `/api/account/profile` in demo mode. */
export function getDemoProfile(): Profile {
  return {
    id: DEMO_USER_ID,
    userName: "demo_admin",
    telegramUsername: null,
    firstName: "Demo",
    lastName: "Admin",
    email: "demo@escobets.com",
    phone: "",
    dateOfBirth: "",
    address: { ...EMPTY_PROFILE_ADDRESS },
    socialLinks: [
      { id: "google", provider: "google", linked: false },
      { id: "x", provider: "x", linked: false },
      { id: "telegram", provider: "telegram", linked: false },
    ],
  };
}
