import type { User, UserIdentity } from "@supabase/supabase-js";
import type { SocialLink } from "@/types/account";
import { isTelegramPlaceholderEmail } from "@/lib/account/telegram-profile-email";

function defaultRow(provider: SocialLink["provider"]): SocialLink {
  return { id: provider, provider, linked: false };
}

const ORDER: SocialLink["provider"][] = ["google", "x", "telegram", "linkedin"];

/** Map Supabase auth identity `provider` to our UI provider key. */
function authProviderToSocial(provider: string): SocialLink["provider"] | null {
  if (provider === "google") return "google";
  if (provider === "twitter" || provider === "x") return "x";
  if (provider === "linkedin" || provider === "linkedin_oidc") return "linkedin";
  if (provider === "telegram") return "telegram";
  return null;
}

/**
 * Public profile DTO: which providers are linked (from JWT / `getUser()` identities
 * and Telegram placeholder email).
 */
export function buildSocialLinksFromUser(user: User | null, resolvedEmail: string): SocialLink[] {
  const byProvider = new Map<SocialLink["provider"], true>();
  for (const ident of user?.identities ?? []) {
    const p = authProviderToSocial(ident.provider);
    if (p) byProvider.set(p, true);
  }
  if (isTelegramPlaceholderEmail(resolvedEmail)) {
    byProvider.set("telegram", true);
  }
  return ORDER.map((p) => ({
    ...defaultRow(p),
    linked: byProvider.has(p),
  }));
}

/** Resolve Supabase `UserIdentity` for unlink, matching our provider key. */
export function findUserIdentity(
  user: User | null,
  provider: SocialLink["provider"]
): UserIdentity | undefined {
  return user?.identities?.find((i) => {
    const s = authProviderToSocial(i.provider);
    return s === provider;
  });
}

/**
 * `provider` for `linkIdentity` — must match the provider enabled in Supabase (X → `x`).
 */
export function supabaseLinkProvider(
  p: SocialLink["provider"]
): "google" | "x" | "linkedin" | null {
  if (p === "google") return "google";
  if (p === "x") return "x";
  if (p === "linkedin") return "linkedin";
  return null;
}

export function isLinkIdentitySupported(p: SocialLink["provider"]): boolean {
  return p === "google" || p === "x" || p === "linkedin";
}
