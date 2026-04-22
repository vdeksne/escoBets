"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ChevronDown, Landmark, Lock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TermsAcceptance } from "@/components/legal/terms-acceptance";
import { getSubscriptionCheckoutUrl } from "@/lib/subscription/hosted-checkout";
import {
  getTelegramSubscriptionPayBotUrl,
  TELEGRAM_PAYMENTS_DOCS_URL,
} from "@/lib/subscription/telegram-payment";

type PlanId = "monthly" | "annual";
type Currency = "GBP" | "EUR";

type PaymentMethodId = "secure-checkout" | "telegram" | "bank";

function RadioRing({ selected }: { selected: boolean }) {
  return (
    <span
      className={cn(
        "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
        selected ? "border-escobets-yellow" : "border-white/25",
      )}
      aria-hidden
    >
      {selected ? (
        <span className="h-1.5 w-1.5 rounded-full bg-escobets-yellow" />
      ) : null}
    </span>
  );
}

const PLANS: {
  id: PlanId;
  label: string;
  hint: string;
  badge?: string;
}[] = [
  { id: "monthly", label: "Pay monthly", hint: "Flexible - cancel when you need to." },
  { id: "annual", label: "Pay annually", badge: "SAVE 15%", hint: "Best value when you want the edge all season." },
];

const BASE_PRICES_GBP: Record<PlanId, { firstCharge: number; displayPerMonth: number }> =
  {
    monthly: { firstCharge: 20, displayPerMonth: 20 },
    annual: { firstCharge: 192, displayPerMonth: 16 },
  };

const DEFAULT_GBP_TO_EUR = 1.17;
function getGbpToEurRate(): number {
  const raw = process.env.NEXT_PUBLIC_SUBSCRIPTION_GBP_TO_EUR_RATE;
  const parsed = raw ? Number.parseFloat(raw) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_GBP_TO_EUR;
}

function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
}

function getPlanPricing({
  plan,
  currency,
  gbpToEurRate,
}: {
  plan: PlanId;
  currency: Currency;
  gbpToEurRate: number;
}): {
  perMonthLabel: string;
  dueTodayLabel: string;
  isEstimated: boolean;
} {
  const base = BASE_PRICES_GBP[plan];

  if (currency === "GBP") {
    return {
      perMonthLabel: `${formatMoney(base.displayPerMonth, "GBP")} / month`,
      dueTodayLabel: formatMoney(base.firstCharge, "GBP"),
      isEstimated: false,
    };
  }

  const fx = gbpToEurRate;
  const first = Math.round(base.firstCharge * fx * 100) / 100;
  const perMonth = Math.round(base.displayPerMonth * fx * 100) / 100;
  return {
    perMonthLabel: `${formatMoney(perMonth, "EUR")} / month`,
    dueTodayLabel: formatMoney(first, "EUR"),
    isEstimated: true,
  };
}

function getDefaultCurrency(): Currency {
  if (typeof window === "undefined") return "GBP";
  const stored = window.localStorage.getItem("esco.currency");
  if (stored === "GBP" || stored === "EUR") return stored;
  const locale = window.navigator.language ?? "";
  return /^en-GB/i.test(locale) ? "GBP" : "EUR";
}

function CurrencySwitch({
  value,
  onChange,
}: {
  value: Currency;
  onChange: (value: Currency) => void;
}) {
  const options: { id: Currency; label: string }[] = [
    { id: "GBP", label: "GBP £" },
    { id: "EUR", label: "EUR €" },
  ];

  return (
    <div className="inline-flex rounded-lg border border-white/15 bg-black/40 p-1">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "rounded-md px-3 py-1.5 font-gotham text-xs font-medium tracking-wide transition-colors",
              active
                ? "bg-white text-black shadow-sm"
                : "text-white/75 hover:bg-white/10 hover:text-white",
            )}
            aria-pressed={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Solid-feeling panels so copy stays readable over busy page backgrounds. */
const readPanel =
  "rounded-xl border border-white/15 bg-[#0a0a0a]/95 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-md";

const INCLUDED = [
  "High-confidence daily picks with clear write-ups",
  "Full profit & loss dashboard - transparent results",
  "Priority delivery in Telegram so you never miss a move",
  "Member access to the private EscoBets Telegram channel after checkout",
];

const MANUAL_TRANSFER_EMAIL = "support@escobets.com";

export function SubscriptionForm({ className }: { className?: string }) {
  const [plan, setPlan] = React.useState<PlanId>("annual");
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [currency, setCurrency] = React.useState<Currency>("GBP");
  const [paymentMethod, setPaymentMethod] =
    React.useState<PaymentMethodId>("secure-checkout");
  const [openPaymentDetail, setOpenPaymentDetail] = React.useState<
    "secure" | "telegram" | "bank" | null
  >(null);

  React.useEffect(() => {
    setCurrency(getDefaultCurrency());
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("esco.currency", currency);
  }, [currency]);

  const gbpToEurRate = React.useMemo(() => getGbpToEurRate(), []);
  const selectedPricing = React.useMemo(
    () => getPlanPricing({ plan, currency, gbpToEurRate }),
    [plan, currency, gbpToEurRate],
  );
  const checkoutUrl = React.useMemo(
    () => getSubscriptionCheckoutUrl(plan),
    [plan],
  );
  const telegramBotUrl = React.useMemo(
    () => getTelegramSubscriptionPayBotUrl(plan),
    [plan],
  );

  const goToHostedCheckout = React.useCallback(() => {
    if (!termsAccepted || !checkoutUrl || paymentMethod !== "secure-checkout")
      return;
    window.location.assign(checkoutUrl);
  }, [termsAccepted, checkoutUrl, paymentMethod]);

  const canUseHostedCheckout =
    termsAccepted &&
    !!checkoutUrl &&
    paymentMethod === "secure-checkout";

  return (
    <div className={cn("mx-auto w-full max-w-5xl px-1 sm:px-0", className)}>
      <div className="mb-8 text-center lg:mb-10 lg:text-left">
        <p className="font-gotham text-xs font-medium uppercase tracking-[0.2em] text-escobets-yellow/90">
          Membership
        </p>
        <h1 className="mt-2 font-gotham text-2xl font-bold text-white sm:text-3xl md:text-4xl">
          Subscribe to{" "}
          <span
            className="text-escobets-yellow"
            style={{ textShadow: "0 0 40px rgba(251, 254, 39, 0.25)" }}
          >
            EscoBets
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl font-gotham text-sm text-white/85 sm:text-base lg:mx-0">
          Elite Telegram betting insights backed by data - one membership for
          picks, analysis, and the tools serious bettors use to stay
          disciplined.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <section className="flex flex-col gap-6 lg:col-span-5">
          <div className={cn(readPanel, "p-6 sm:p-7")}>
            <h2 className="font-gotham text-lg font-semibold text-white">
              What you get
            </h2>
            <ul className="mt-4 space-y-3">
              {INCLUDED.map((line) => (
                <li
                  key={line}
                  className="flex gap-3 text-left font-gotham text-sm text-white/90"
                >
                  <Check
                    className="mt-0.5 h-5 w-5 shrink-0 text-escobets-yellow"
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-white/15 pt-4 font-gotham text-xs leading-relaxed text-white/70">
              After payment succeeds, you&apos;ll be taken to a confirmation
              screen with your private Telegram invite - that&apos;s where picks
              and alerts are posted.
            </p>
          </div>
          <div
            className={cn(
              readPanel,
              "flex items-start gap-2 px-4 py-3 font-gotham text-xs leading-relaxed text-white/80",
            )}
          >
            <Lock
              className="mt-0.5 h-4 w-4 shrink-0 text-escobets-yellow/80"
              aria-hidden
            />
            <span>
              Card and wallet details are entered on our payment partner&apos;s
              secure hosted page - not on this screen.
            </span>
          </div>
        </section>

        <div className="flex flex-col gap-8 lg:col-span-7">
          <div className={cn(readPanel, "p-6 sm:p-7")}>
            <h2 className="font-gotham text-lg font-semibold text-white">
              Choose your plan
            </h2>
            <p className="mt-1 font-gotham text-sm text-white/78">
              Select billing - checkout opens on our provider after you accept
              the terms below.
            </p>
            <div className="mt-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <p className="font-gotham text-xs font-medium uppercase tracking-wide text-white/65">
                  Currency
                </p>
                <p className="mt-0.5 font-gotham text-xs leading-snug text-white/70">
                  {currency === "EUR"
                    ? "EUR prices are estimated from GBP."
                    : "Prices shown in British pounds (GBP)."}
                </p>
              </div>
              <CurrencySwitch value={currency} onChange={setCurrency} />
            </div>
            <div className="mt-5 space-y-3">
              {PLANS.map((p) => {
                  const rowPricing = getPlanPricing({
                    plan: p.id,
                    currency,
                    gbpToEurRate,
                  });
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlan(p.id)}
                      className={cn(
                        "flex w-full flex-col gap-1 rounded-lg border p-4 text-left transition-colors sm:flex-row sm:items-center sm:justify-between",
                        plan === p.id
                          ? "border-escobets-yellow/70 bg-escobets-yellow/15"
                          : "border-white/18 bg-black/70 hover:border-white/35",
                      )}
                    >
                      <div>
                        <span className="font-gotham font-medium text-white">
                          {p.label}
                        </span>
                        <p className="mt-0.5 font-gotham text-sm text-white/90">
                          {rowPricing.perMonthLabel}
                        </p>
                        <p className="mt-1 font-gotham text-xs text-white/70">
                          {p.hint}
                        </p>
                      </div>
                      {p.badge ? (
                        <span className="mt-2 w-fit rounded bg-escobets-yellow px-2.5 py-1 font-gotham text-xs font-bold text-black sm:mt-0">
                          {p.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
            </div>
            <div className="mt-6 border-t border-white/20 pt-6">
              <h3 className="font-gotham text-xs font-medium uppercase tracking-wide text-white/65">
                Due today
              </h3>
              <p className="mt-1 font-gotham text-2xl font-bold text-white">
                {selectedPricing.dueTodayLabel}
              </p>
              {selectedPricing.isEstimated ? (
                <p className="mt-1 font-gotham text-xs text-white/60">
                  Estimated (FX rate: {gbpToEurRate.toFixed(2)}).
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-6">
            <p className="font-gotham text-xs font-medium uppercase tracking-wide text-white/45">
              Payment method
            </p>
            <div
              role="radiogroup"
              aria-label="Payment method"
              className="space-y-3"
            >
              <div
                className={cn(
                  "overflow-hidden rounded-xl border transition-colors",
                  paymentMethod === "secure-checkout"
                    ? "border border-escobets-yellow/40 bg-escobets-yellow/[0.04]"
                    : "border border-white/10 bg-[#0a0a0a]/95",
                )}
              >
                <div className="flex min-h-[3.25rem]">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={paymentMethod === "secure-checkout"}
                    onClick={() => setPaymentMethod("secure-checkout")}
                    className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3.5 text-left"
                  >
                    <RadioRing selected={paymentMethod === "secure-checkout"} />
                    <div className="min-w-0">
                      <p className="font-gotham text-base font-semibold text-white">
                        Secure checkout
                      </p>
                      <p className="mt-0.5 font-gotham text-xs text-white/40">
                        Card or wallet — hosted by our partner
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenPaymentDetail((o) => (o === "secure" ? null : "secure"))
                    }
                    className="shrink-0 border-l border-white/10 px-3 text-white/40 transition-colors hover:text-white/70"
                    aria-expanded={openPaymentDetail === "secure"}
                    aria-label={
                      openPaymentDetail === "secure"
                        ? "Hide details for secure checkout"
                        : "Show details for secure checkout"
                    }
                  >
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 transition-transform duration-200",
                        openPaymentDetail === "secure" && "rotate-180",
                      )}
                    />
                  </button>
                </div>
                {openPaymentDetail === "secure" ? (
                  <div className="space-y-3 border-t border-white/10 px-4 pb-4 pt-3 sm:px-5">
                    <p className="font-gotham text-sm font-normal leading-relaxed text-white/80">
                      You&apos;ll continue in this browser to our payment
                      partner&apos;s hosted checkout: a separate, encrypted page
                      where you enter card or wallet details. They process the
                      charge, run standard fraud checks, and only pass us what
                      we need to turn on your membership—not your full card
                      number. If the button stays disabled, add the hosted
                      checkout URLs in your environment variables and redeploy.
                    </p>
                    <p className="font-gotham text-xs leading-relaxed text-white/60">
                      After a successful payment, you should be sent back to{" "}
                      <code className="rounded border border-white/15 bg-black/40 px-1.5 py-0.5 font-mono text-[11px] text-white/85">
                        /subscription/confirmation
                      </code>
                      . If you land on the provider&apos;s generic “thank you”
                      page instead, open your hosted payment link in their
                      dashboard and set{" "}
                      <span className="font-medium text-white/80">
                        After payment → Redirect
                      </span>{" "}
                      to our confirmation URL.
                    </p>
                    {!checkoutUrl ? (
                      <div
                        role="status"
                        className="rounded-lg border border-amber-400/35 bg-amber-950/85 px-3.5 py-3 font-gotham text-sm leading-snug text-amber-50 shadow-inner shadow-black/20"
                      >
                        <p className="font-medium text-amber-100">
                          Checkout URL not configured
                        </p>
                        <p className="mt-2 text-[13px] text-amber-50/95">
                          Set{" "}
                          <code className="rounded border border-amber-500/25 bg-black/50 px-1.5 py-0.5 font-mono text-[11px] text-amber-100 sm:text-xs">
                            NEXT_PUBLIC_SUBSCRIPTION_STRIPE_PAYMENT_LINK_URL_MONTHLY
                          </code>{" "}
                          and{" "}
                          <code className="rounded border border-amber-500/25 bg-black/50 px-1.5 py-0.5 font-mono text-[11px] text-amber-100 sm:text-xs">
                            NEXT_PUBLIC_SUBSCRIPTION_STRIPE_PAYMENT_LINK_URL_ANNUAL
                          </code>{" "}
                          .
                          in{" "}
                          <code className="rounded border border-amber-500/25 bg-black/50 px-1.5 py-0.5 font-mono text-[11px] text-amber-100 sm:text-xs">
                            .env.local
                          </code>{" "}
                          or Vercel, then redeploy.
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div
                className={cn(
                  "overflow-hidden rounded-xl border transition-colors",
                  paymentMethod === "telegram"
                    ? "border border-escobets-yellow/40 bg-escobets-yellow/[0.04]"
                    : "border border-dashed border-sky-500/20 bg-[#070b10]/80",
                )}
              >
                <div className="flex min-h-[3.25rem]">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={paymentMethod === "telegram"}
                    onClick={() => setPaymentMethod("telegram")}
                    className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3.5 text-left"
                  >
                    <RadioRing selected={paymentMethod === "telegram"} />
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-sky-500/25 bg-sky-950/50">
                        <Send className="h-3.5 w-3.5 text-sky-300" aria-hidden />
                      </div>
                      <p className="min-w-0 font-gotham text-base font-semibold text-white">
                        Telegram payment
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenPaymentDetail((o) => (o === "telegram" ? null : "telegram"))
                    }
                    className="shrink-0 border-l border-white/10 px-3 text-white/40 transition-colors hover:text-white/70"
                    aria-expanded={openPaymentDetail === "telegram"}
                    aria-label={
                      openPaymentDetail === "telegram"
                        ? "Hide details for Telegram payment"
                        : "Show details for Telegram payment"
                    }
                  >
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 transition-transform duration-200",
                        openPaymentDetail === "telegram" && "rotate-180",
                      )}
                    />
                  </button>
                </div>
                {openPaymentDetail === "telegram" ? (
                  <div className="space-y-3 border-t border-white/10 px-4 pb-4 pt-3 sm:px-5">
                    <p className="font-gotham text-sm font-normal leading-relaxed text-white/80">
                      <span className="font-medium text-white/95">Coming soon.</span>{" "}
                      We plan to offer{" "}
                      <a
                        href={TELEGRAM_PAYMENTS_DOCS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-escobets-yellow underline decoration-escobets-yellow/60 underline-offset-[3px] hover:text-[#f5f877] hover:decoration-escobets-yellow"
                      >
                        Telegram Bot Payments
                      </a>{" "}
                      (in-app invoice). You still need a provider token from a
                      PSP - same compliance story as web checkout.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      disabled
                      className="w-full rounded-[0.83331rem] border-white/30 bg-black/30 font-gotham text-white/65 sm:w-auto sm:min-w-[14rem]"
                    >
                      Pay in Telegram - coming soon
                    </Button>
                    {telegramBotUrl ? (
                      <p className="font-gotham text-[13px] leading-snug text-white/65">
                        Dev / support:{" "}
                        <a
                          href={telegramBotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-escobets-yellow underline hover:text-[#f5f877]"
                        >
                          Open bot in Telegram
                        </a>{" "}
                        <span className="text-white/50">
                          (deep link only - does not start payment yet).
                        </span>
                      </p>
                    ) : (
                      <p className="font-gotham text-[13px] leading-snug text-white/65">
                        Optional: set{" "}
                        <code className="rounded border border-white/15 bg-black/50 px-1.5 py-0.5 font-mono text-[11px] text-white/90 sm:text-xs">
                          NEXT_PUBLIC_SUBSCRIPTION_TELEGRAM_PAY_BOT_USERNAME
                        </code>{" "}
                        for an “open bot” test link.
                      </p>
                    )}
                  </div>
                ) : null}
              </div>

              <div
                className={cn(
                  "overflow-hidden rounded-xl border transition-colors",
                  paymentMethod === "bank"
                    ? "border border-escobets-yellow/40 bg-escobets-yellow/[0.04]"
                    : "border border-dashed border-emerald-500/20 bg-[#07100b]/80",
                )}
              >
                <div className="flex min-h-[3.25rem]">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={paymentMethod === "bank"}
                    onClick={() => setPaymentMethod("bank")}
                    className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3.5 text-left"
                  >
                    <RadioRing selected={paymentMethod === "bank"} />
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-emerald-500/25 bg-emerald-950/50">
                        <Landmark
                          className="h-3.5 w-3.5 text-emerald-200"
                          aria-hidden
                        />
                      </div>
                      <p className="min-w-0 font-gotham text-base font-semibold text-white">
                        Manual bank transfer
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenPaymentDetail((o) => (o === "bank" ? null : "bank"))
                    }
                    className="shrink-0 border-l border-white/10 px-3 text-white/40 transition-colors hover:text-white/70"
                    aria-expanded={openPaymentDetail === "bank"}
                    aria-label={
                      openPaymentDetail === "bank"
                        ? "Hide details for bank transfer"
                        : "Show details for bank transfer"
                    }
                  >
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 transition-transform duration-200",
                        openPaymentDetail === "bank" && "rotate-180",
                      )}
                    />
                  </button>
                </div>
                {openPaymentDetail === "bank" ? (
                  <div className="space-y-3 border-t border-white/10 px-4 pb-4 pt-3 sm:px-5">
                    <p className="font-gotham text-sm font-normal leading-relaxed text-white/80">
                      <span className="font-medium text-white/95">Coming soon.</span>{" "}
                      For teams that prefer invoices or manual transfers, we&apos;ll
                      provide bank details and activate your membership after
                      payment confirmation.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      disabled
                      className="w-full rounded-[0.83331rem] border-white/30 bg-black/30 font-gotham text-white/65 sm:w-auto sm:min-w-[14rem]"
                    >
                      Request bank details — coming soon
                    </Button>
                    <p className="font-gotham text-[13px] leading-snug text-white/65">
                      Placeholder: email{" "}
                      <a
                        href={`mailto:${MANUAL_TRANSFER_EMAIL}`}
                        className="font-medium text-escobets-yellow underline hover:text-[#f5f877]"
                      >
                        {MANUAL_TRANSFER_EMAIL}
                      </a>{" "}
                      with your name + plan (monthly/annual). We&apos;ll reply
                      with payment instructions and activation timing.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <TermsAcceptance
              idPrefix="subscription"
              accepted={termsAccepted}
              onAcceptedChange={setTermsAccepted}
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button
                variant="outline"
                asChild
                className="flex-1 rounded-[0.83331rem] border-[1.333px] border-[#FBFE27] bg-transparent text-white hover:bg-[#FBFE27]/10"
              >
                <Link prefetch={false} href="/">
                  Cancel
                </Link>
              </Button>
              <Button
                type="button"
                onClick={goToHostedCheckout}
                disabled={!canUseHostedCheckout}
                title={
                  !termsAccepted
                    ? "Accept the Terms and Conditions to continue"
                    : !checkoutUrl
                    ? "Configure hosted checkout URLs in the environment"
                    : paymentMethod !== "secure-checkout"
                    ? "Select card checkout to pay with this form"
                    : undefined
                }
                className="flex-1 rounded-[0.83331rem] bg-escobets-yellow text-black hover:bg-escobets-yellow/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {paymentMethod === "secure-checkout"
                  ? "Continue to secure checkout"
                  : "Select card checkout to continue"}
              </Button>
            </div>

            <p className="rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 font-gotham text-sm leading-relaxed text-white/82">
              Payment is processed by our payment partner. Your subscription is
              subject to our{" "}
              <Link
                prefetch={false}
                href="/terms"
                className="font-medium text-escobets-yellow underline hover:no-underline"
              >
                Terms and Conditions
              </Link>
              .
            </p>

            {process.env.NODE_ENV === "development" && (
              <p className="font-gotham text-xs text-white/65">
                Dev:{" "}
                <Link
                  prefetch={false}
                  href="/subscription/confirmation"
                  className="underline hover:text-white"
                >
                  View confirmation page
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
