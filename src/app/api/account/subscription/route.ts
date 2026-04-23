import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, isStripeSecretConfigured } from "@/lib/stripe/server";
import { STRIPE_ENV_HELP } from "@/lib/stripe/env-help";
import { createClient } from "@/lib/supabase/server";
import type { SubscriptionAccountData } from "@/types/subscription-account";

function formatMoney(amountMinor: number | null, currency: string) {
  const amount = (amountMinor ?? 0) / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

function formatDateFromUnix(unixSeconds: number | null | undefined) {
  if (!unixSeconds) return "";
  const d = new Date(unixSeconds * 1000);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

/** Stripe API returns this; generated Subscription typings omit it in some SDK versions. */
function subscriptionCurrentPeriodEndUnix(sub: Stripe.Subscription | null): number | null {
  if (!sub) return null;
  const raw = (sub as Stripe.Subscription & { current_period_end?: unknown }).current_period_end;
  return typeof raw === "number" ? raw : null;
}

async function getOrCreateCustomer(email: string) {
  const stripe = getStripe();
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data[0]) return existing.data[0];
  return await stripe.customers.create({ email });
}

async function resolvePlanName(stripe: ReturnType<typeof getStripe>, price: Stripe.Price | null) {
  if (!price) return "Membership";

  const nickname = price.nickname?.trim();
  if (nickname) return nickname;

  const productId = typeof price.product === "string" ? price.product : price.product?.id;
  if (!productId) return "Membership";

  const product = await stripe.products.retrieve(productId);
  return product.name?.trim() || "Membership";
}

export async function GET() {
  if (!isStripeSecretConfigured()) {
    return NextResponse.json(
      {
        error: {
          code: "STRIPE_NOT_CONFIGURED" as const,
          message: STRIPE_ENV_HELP,
        },
      },
      { status: 503 }
    );
  }
  try {
    const stripe = getStripe();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const customer = await getOrCreateCustomer(user.email);

    const customerWithPM = await stripe.customers.retrieve(customer.id, {
      expand: ["invoice_settings.default_payment_method"],
    });

    const safeCustomer =
      typeof customerWithPM === "string" || ("deleted" in customerWithPM && customerWithPM.deleted)
        ? null
        : customerWithPM;

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      limit: 1,
      // Stripe limits expand depth; avoid `...price.product` here.
      expand: ["data.items.data.price"],
    });

    const sub = subscriptions.data[0] ?? null;
    const item = sub?.items.data[0] ?? null;
    const price = item?.price ?? null;
    const recurring = price?.recurring ?? null;

    const planName = await resolvePlanName(stripe, price);

    const billingCycle = recurring?.interval === "year" ? "annual" : "monthly";

    const unit = price?.unit_amount ?? null;
    const currency = price?.currency ?? "gbp";

    const defaultPm =
      safeCustomer?.invoice_settings.default_payment_method &&
      typeof safeCustomer.invoice_settings.default_payment_method !== "string"
        ? safeCustomer.invoice_settings.default_payment_method
        : null;

    const card = defaultPm?.card ?? null;

    const invoices = await stripe.invoices.list({
      customer: customer.id,
      limit: 12,
    });

    const data: SubscriptionAccountData = {
      planSummary: {
        planName,
        billingCycle,
        planCost:
          recurring?.interval === "year"
            ? `${formatMoney(unit, currency)} / year`
            : `${formatMoney(unit, currency)} / month`,
        nextBillingDate: formatDateFromUnix(subscriptionCurrentPeriodEndUnix(sub)),
        status: sub?.status ?? "inactive",
      },
      paymentMethod: {
        brand: card?.brand ? card.brand.toUpperCase() : "Card",
        last4: card?.last4 ?? "—",
        expiryMonth: card?.exp_month ? String(card.exp_month).padStart(2, "0") : "—",
        expiryYear: card?.exp_year ? String(card.exp_year) : "—",
        billingEmail: user.email,
      },
      invoices: invoices.data.map((inv) => ({
        id: inv.number ?? inv.id,
        billingDate: formatDateFromUnix(inv.created),
        plan: planName,
        amount: formatMoney(inv.total, inv.currency),
        status: inv.status === "paid" ? "paid" : "pending",
        downloadUrl: inv.invoice_pdf ?? inv.hosted_invoice_url ?? undefined,
      })),
    };

    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Stripe error";
    return NextResponse.json(
      { error: { code: "STRIPE_ERROR" as const, message } },
      { status: 500 }
    );
  }
}

