import type { User } from "@supabase/supabase-js";
import type Stripe from "stripe";
import type { AdminUser, UserStatus } from "@/types/user";
import { getStripe } from "@/lib/stripe/server";

/** Lower = higher priority (shown when a customer has multiple subscription rows). */
function rankForUserStatus(s: UserStatus): number {
  switch (s) {
    case "Complete":
      return 0;
    case "Failed":
      return 1;
    case "Pending":
      return 2;
    case "Archived":
      return 3;
    default:
      return 4;
  }
}

/**
 * Maps Stripe subscription state to the admin Users list status (subscription-based).
 * - **Complete** — `active` or `trialing` (membership in good standing for access).
 * - **Pending** — not subscribed, or `incomplete` (checkout not finished).
 * - **Failed** — payment / renewal problems.
 * - **Archived** — ended: `canceled` or `paused`.
 */
export function mapStripeSubscriptionToUserStatus(
  status: Stripe.Subscription.Status
): UserStatus {
  switch (status) {
    case "active":
    case "trialing":
      return "Complete";
    case "canceled":
    case "paused":
      return "Archived";
    case "incomplete":
      return "Pending";
    case "incomplete_expired":
    case "past_due":
    case "unpaid":
      return "Failed";
    default:
      return "Pending";
  }
}

type EmailStatusPick = { status: UserStatus; rank: number };

/**
 * Lists all subscriptions (paginated) and returns the best status per **customer email**.
 * Returns `null` if Stripe is not configured or the request failed (caller may fall back).
 */
export async function fetchEmailToUserStatusFromStripe(): Promise<{
  byEmail: Map<string, UserStatus> | null;
  error: string | null;
}> {
  try {
    const stripe = getStripe();
    const byEmail = new Map<string, EmailStatusPick>();

    let startingAfter: string | undefined;
    let hasMore = true;
    while (hasMore) {
      const page: Stripe.Response<Stripe.ApiList<Stripe.Subscription>> =
        await stripe.subscriptions.list({
          status: "all",
          limit: 100,
          starting_after: startingAfter,
          expand: ["data.customer"],
        });

      for (const sub of page.data) {
        const c = sub.customer;
        if (typeof c === "string") continue;
        if ("deleted" in c && c.deleted) continue;
        const emailRaw = c.email;
        if (typeof emailRaw !== "string" || !emailRaw.trim()) continue;
        const email = emailRaw.toLowerCase().trim();
        const uStatus = mapStripeSubscriptionToUserStatus(sub.status);
        const rank = rankForUserStatus(uStatus);
        const prev = byEmail.get(email);
        if (!prev || rank < prev.rank) {
          byEmail.set(email, { status: uStatus, rank });
        }
      }

      hasMore = page.has_more;
      if (page.data.length > 0) {
        startingAfter = page.data[page.data.length - 1]!.id;
      } else {
        hasMore = false;
      }
    }

    return {
      byEmail: new Map(
        [...byEmail.entries()].map(([e, v]) => [e, v.status] as [string, UserStatus])
      ),
      error: null,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Stripe error";
    return { byEmail: null, error: message };
  }
}

/**
 * Overwrites `fromAuth[].status` from Stripe, or (if `byEmail` is `null`) from email confirmation.
 */
export function applyAdminUserSubscriptionStatus(
  fromAuth: AdminUser[],
  authUsers: User[],
  byEmail: Map<string, UserStatus> | null
): void {
  if (byEmail === null) {
    for (let i = 0; i < fromAuth.length; i++) {
      const au = authUsers.find((x) => x.id === fromAuth[i]!.id);
      const st: UserStatus = au?.email_confirmed_at ? "Complete" : "Pending";
      fromAuth[i] = { ...fromAuth[i]!, status: st };
    }
    return;
  }

  for (let i = 0; i < fromAuth.length; i++) {
    const email = fromAuth[i]!.email.toLowerCase().trim();
    if (!email) {
      fromAuth[i] = { ...fromAuth[i]!, status: "Pending" };
      continue;
    }
    const s = byEmail.get(email);
    if (s !== undefined) {
      fromAuth[i] = { ...fromAuth[i]!, status: s };
    } else {
      fromAuth[i] = { ...fromAuth[i]!, status: "Pending" };
    }
  }
}
