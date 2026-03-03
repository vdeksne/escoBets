"use client";

import type { PaymentMethod as PaymentMethodType } from "@/types/subscription-account";
import { cn } from "@/lib/utils";

/** MasterCard-style overlapping circles */
function MasterCardLogo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-8 w-12 shrink-0", className)}
      viewBox="0 0 48 32"
      fill="none"
      aria-hidden
    >
      <circle cx="18" cy="16" r="11" fill="#EB001B" />
      <circle cx="30" cy="16" r="11" fill="#F79E1B" />
    </svg>
  );
}

interface PaymentMethodProps {
  data: PaymentMethodType;
  onChange?: () => void;
  className?: string;
}

export function PaymentMethod({ data, onChange, className }: PaymentMethodProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-black/40 p-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-gotham text-lg font-semibold text-white">
          Payment Method
        </h2>
        <button
          type="button"
          onClick={onChange}
          className="font-gotham text-sm text-white underline hover:no-underline"
        >
          Change
        </button>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <MasterCardLogo />
        <div>
          <p className="font-gotham font-medium text-white">{data.brand}</p>
          <p className="font-gotham text-sm text-white/70">
            **** **** {data.last4}
          </p>
          <p className="font-gotham text-sm text-white/60">
            Expiry on {data.expiryMonth}/{data.expiryYear}
          </p>
          <p className="font-gotham text-sm text-white/60">{data.billingEmail}</p>
        </div>
      </div>
    </div>
  );
}
