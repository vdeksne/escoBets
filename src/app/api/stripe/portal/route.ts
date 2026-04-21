import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/server";

async function getOrigin() {
  const h = await headers();
  const origin = h.get("origin");
  if (origin) return origin;
  const host = h.get("host");
  return host ? `https://${host}` : "http://localhost:3000";
}

async function getOrCreateCustomerId(email: string) {
  const stripe = getStripe();
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data[0]?.id) return existing.data[0].id;
  const created = await stripe.customers.create({ email });
  return created.id;
}

export async function GET() {
  try {
    const stripe = getStripe();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.redirect(new URL("/login", await getOrigin()));
    }

    const customerId = await getOrCreateCustomerId(user.email);
    const returnUrl = new URL("/account/subscription", await getOrigin()).toString();

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return NextResponse.redirect(session.url);
  } catch {
    return NextResponse.redirect(new URL("/account/subscription", await getOrigin()));
  }
}

