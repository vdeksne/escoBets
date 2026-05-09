import Stripe from "stripe";
import { STRIPE_ENV_HELP } from "./env-help";

const MISSING_KEY_MESSAGE =
  "Missing STRIPE_SECRET_KEY (or STRIPE_SECRET_KEY_TEST) environment variable. " + STRIPE_ENV_HELP;

function getStripeSecretKey(): string {
  const key =
    process.env.STRIPE_SECRET_KEY?.trim() ||
    process.env.STRIPE_SECRET_KEY_TEST?.trim() ||
    "";
  if (!key) {
    throw new Error(MISSING_KEY_MESSAGE);
  }
  return key;
}

/** True when a secret key is set (billing portal + subscription API can call Stripe). */
export function isStripeSecretConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY?.trim() || process.env.STRIPE_SECRET_KEY_TEST?.trim()
  );
}

let cachedStripe: Stripe | null = null;

export function getStripe() {
  if (cachedStripe) return cachedStripe;
  cachedStripe = new Stripe(getStripeSecretKey(), {
    apiVersion: "2026-04-22.dahlia",
  });
  return cachedStripe;
}

