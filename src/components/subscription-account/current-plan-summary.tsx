"use client";

import { Button } from "@/components/ui/button";
import type { PlanSummary } from "@/types/subscription-account";
import { cn } from "@/lib/utils";

interface CurrentPlanSummaryProps {
  data: PlanSummary;
  onUpgrade?: () => void;
  className?: string;
}

const BILLING_CYCLE_LABELS: Record<string, string> = {
  monthly: "Monthly",
  annual: "Annual",
};

export function CurrentPlanSummary({
  data,
  onUpgrade,
  className,
}: CurrentPlanSummaryProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-black/40 p-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-gotham text-lg font-semibold text-white">
          Subscription
        </h2>
        <Button
          type="button"
          onClick={onUpgrade}
          className="rounded-lg bg-escobets-yellow px-4 py-2 font-gotham font-medium text-black hover:bg-escobets-yellow/90"
        >
          Manage billing
        </Button>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        <div>
          <p className="font-gotham text-xs uppercase tracking-wider text-white/50">
            Plan Name
          </p>
          <p className="mt-1 font-gotham text-base font-medium text-white">
            {data.planName}
          </p>
        </div>
        <div>
          <p className="font-gotham text-xs uppercase tracking-wider text-white/50">
            Billing Cycle
          </p>
          <p className="mt-1 font-gotham text-base font-medium text-white">
            {BILLING_CYCLE_LABELS[data.billingCycle] ?? data.billingCycle}
          </p>
        </div>
        <div>
          <p className="font-gotham text-xs uppercase tracking-wider text-white/50">
            Plan Cost
          </p>
          <p className="mt-1 font-gotham text-base font-medium text-white">
            {data.planCost}
          </p>
        </div>
        {data.nextBillingDate ? (
          <div>
            <p className="font-gotham text-xs uppercase tracking-wider text-white/50">
              Next billing date
            </p>
            <p className="mt-1 font-gotham text-base font-medium text-white">
              {data.nextBillingDate}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
