import Stripe from "stripe";

function getStripeSecretKey(): string {
  const key =
    process.env.STRIPE_SECRET_KEY?.trim() ||
    process.env.STRIPE_SECRET_KEY_TEST?.trim() ||
    "";
  if (!key) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY (or STRIPE_SECRET_KEY_TEST) environment variable."
    );
  }
  return key;
}

let cachedStripe: Stripe | null = null;

export function getStripe() {
  if (cachedStripe) return cachedStripe;
  cachedStripe = new Stripe(getStripeSecretKey(), {
    apiVersion: "2026-03-25.dahlia",
  });
  return cachedStripe;
}

