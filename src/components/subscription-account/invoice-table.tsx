"use client";

import * as React from "react";
import type { Invoice } from "@/types/subscription-account";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface InvoiceTableProps {
  invoices: Invoice[];
  className?: string;
}

type SortKey = "id" | "billingDate" | "plan" | "amount" | "status";
type SortDir = "asc" | "desc";

function parseDateLoose(value: string) {
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : null;
}

function parseMoneyLoose(value: string) {
  // Accepts strings like "£20.00", "€ 20,00", "$20", etc.
  const normalized = value.replace(/[^\d.,-]/g, "").trim();
  if (!normalized) return null;

  // If both comma and dot exist, assume comma is thousands separator.
  if (normalized.includes(",") && normalized.includes(".")) {
    const n = Number.parseFloat(normalized.replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  }

  // If only comma exists, treat comma as decimal separator.
  if (normalized.includes(",") && !normalized.includes(".")) {
    const n = Number.parseFloat(normalized.replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }

  const n = Number.parseFloat(normalized);
  return Number.isFinite(n) ? n : null;
}

export function InvoiceTable({
  invoices,
  className,
}: InvoiceTableProps) {
  const [sortKey, setSortKey] = React.useState<SortKey>("billingDate");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");

  const handleSort = (key: string) => {
    if (key === "download") return;
    const k = key as SortKey;
    setSortKey((prev) => {
      if (prev !== k) {
        setSortDir("asc");
        return k;
      }
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return prev;
    });
  };

  const sortedInvoices = React.useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    const copy = [...invoices];

    const compareText = (a: string, b: string) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

    copy.sort((a, b) => {
      switch (sortKey) {
        case "id":
          return dir * compareText(a.id, b.id);
        case "billingDate": {
          const da = parseDateLoose(a.billingDate);
          const db = parseDateLoose(b.billingDate);
          if (da != null && db != null) return dir * (da - db);
          return dir * compareText(a.billingDate, b.billingDate);
        }
        case "plan":
          return dir * compareText(a.plan, b.plan);
        case "amount": {
          const ma = parseMoneyLoose(a.amount);
          const mb = parseMoneyLoose(b.amount);
          if (ma != null && mb != null) return dir * (ma - mb);
          return dir * compareText(a.amount, b.amount);
        }
        case "status": {
          const rank = (s: Invoice["status"]) => (s === "paid" ? 0 : 1);
          return dir * (rank(a.status) - rank(b.status));
        }
        default:
          return 0;
      }
    });

    return copy;
  }, [invoices, sortDir, sortKey]);

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
            Invoices
          </h2>
          <p className="mt-1 font-gotham text-sm text-white/60">
            Download PDFs securely from Stripe.
          </p>
        </div>
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
                { key: "download", label: "" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className={cn(
                    "py-3 pr-4 text-left",
                    key === "download" && "pr-0 text-right"
                  )}
                >
                  {key === "download" ? null : (
                    <button
                      type="button"
                      onClick={() => handleSort(key)}
                      className="flex items-center gap-1 font-gotham text-xs uppercase tracking-wider text-white/50 hover:text-white/70"
                    >
                      {label}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          sortKey === key && sortDir === "desc" && "rotate-180",
                          sortKey !== key && "opacity-40"
                        )}
                      />
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedInvoices.map((inv) => (
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
                <td className="py-4 text-right">
                  {inv.downloadUrl ? (
                    <a
                      href={inv.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-md border border-white/15 bg-black/30 px-3 py-1.5 font-gotham text-xs font-medium text-white/85 hover:bg-white/10 hover:text-white"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="font-gotham text-xs text-white/45">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
