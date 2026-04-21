"use client";

import { CurrentPlanSummary } from "./current-plan-summary";
import { PaymentMethod } from "./payment-method";
import { InvoiceTable } from "./invoice-table";
import type { SubscriptionAccountData } from "@/types/subscription-account";
import { cn } from "@/lib/utils";

interface SubscriptionAccountViewProps {
  data: SubscriptionAccountData;
  onUpgrade?: () => void;
  onChangePayment?: () => void;
  className?: string;
}

export function SubscriptionAccountView({
  data,
  onUpgrade,
  onChangePayment,
  className,
}: SubscriptionAccountViewProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <CurrentPlanSummary data={data.planSummary} onUpgrade={onUpgrade} />
      <PaymentMethod data={data.paymentMethod} onChange={onChangePayment} />
      <InvoiceTable invoices={data.invoices} />
    </div>
  );
}
