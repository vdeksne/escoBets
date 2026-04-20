/**
 * Hosted checkout URLs from your PSP (payment service provider): Lemon Squeezy, Paddle,
 * regional acquirer hosted pages, etc.
 *
 * Set either:
 * - `NEXT_PUBLIC_SUBSCRIPTION_CHECKOUT_URL` — one link for every plan, or
 * - `NEXT_PUBLIC_SUBSCRIPTION_CHECKOUT_URL_MONTHLY` / `…_ANNUAL` — per plan (each falls back to the generic URL when empty).
 *
 * Stripe Payment Links (recommended quick setup):
 * - `NEXT_PUBLIC_SUBSCRIPTION_STRIPE_PAYMENT_LINK_URL_MONTHLY` / `…_ANNUAL` — per plan.
 *
 * In the provider dashboard, set the **success / thank-you URL** to:
 * `https://<your-domain>/subscription/confirmation`
 */
export function getSubscriptionCheckoutUrl(plan: "monthly" | "annual"): string | null {
  const stripeMonthly =
    process.env.NEXT_PUBLIC_SUBSCRIPTION_STRIPE_PAYMENT_LINK_URL_MONTHLY?.trim() ?? "";
  const stripeAnnual =
    process.env.NEXT_PUBLIC_SUBSCRIPTION_STRIPE_PAYMENT_LINK_URL_ANNUAL?.trim() ?? "";

  const fallback = process.env.NEXT_PUBLIC_SUBSCRIPTION_CHECKOUT_URL?.trim() ?? "";
  const monthly =
    stripeMonthly || process.env.NEXT_PUBLIC_SUBSCRIPTION_CHECKOUT_URL_MONTHLY?.trim() || fallback;
  const annual =
    stripeAnnual || process.env.NEXT_PUBLIC_SUBSCRIPTION_CHECKOUT_URL_ANNUAL?.trim() || fallback;

  const raw = plan === "monthly" ? monthly : annual;
  if (!raw || !/^https?:\/\//i.test(raw)) return null;
  return raw;
}
