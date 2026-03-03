"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import type { Invoice } from "@/types/subscription-account";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface InvoiceTableProps {
  invoices: Invoice[];
  onDownload?: () => void;
  className?: string;
}

export function InvoiceTable({
  invoices,
  onDownload,
  className,
}: InvoiceTableProps) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);

  const handleSort = (key: string) => {
    setSortKey((k) => (k === key ? null : key));
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-black/40 p-6",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-gotham text-lg font-semibold text-white">
            Invoice
          </h2>
          <p className="mt-1 font-gotham text-sm text-white/60">
            Effortlessly handle your billing and invoices right here.
          </p>
        </div>
        <Button
          type="button"
          onClick={onDownload}
          className="shrink-0 rounded-lg bg-escobets-yellow px-4 py-2 font-gotham font-medium text-black hover:bg-escobets-yellow/90"
        >
          Download
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-white/10">
              {[
                { key: "id", label: "Invoice ID" },
                { key: "billingDate", label: "Billing Date" },
                { key: "plan", label: "Plan" },
                { key: "amount", label: "Amount" },
                { key: "status", label: "Status" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="py-3 pr-4 text-left"
                >
                  <button
                    type="button"
                    onClick={() => handleSort(key)}
                    className="flex items-center gap-1 font-gotham text-xs uppercase tracking-wider text-white/50 hover:text-white/70"
                  >
                    {label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        sortKey === key && "rotate-180"
                      )}
                    />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr
                key={inv.id}
                className="border-b border-white/5 last:border-0"
              >
                <td className="py-4 pr-4 font-gotham text-sm text-white">
                  #{inv.id}
                </td>
                <td className="py-4 pr-4 font-gotham text-sm text-white/90">
                  {inv.billingDate}
                </td>
                <td className="py-4 pr-4 font-gotham text-sm text-white/90">
                  {inv.plan}
                </td>
                <td className="py-4 pr-4 font-gotham text-sm text-white/90">
                  {inv.amount}
                </td>
                <td className="py-4 pr-4">
                  <span
                    className={cn(
                      "inline-flex rounded-md px-2.5 py-1 font-gotham text-xs font-medium",
                      inv.status === "paid"
                        ? "bg-escobets-yellow text-black"
                        : "bg-white text-black"
                    )}
                  >
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
