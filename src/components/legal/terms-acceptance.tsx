"use client";

import * as React from "react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { TERMS_LAST_UPDATED_LABEL, TermsAndConditionsBody } from "@/components/legal/terms-content";
import { cn } from "@/lib/utils";

const ACCORDION_VALUE = "terms";

export type TermsAcceptanceProps = {
  /** For unique `id` / `htmlFor` when multiple instances exist on one page. */
  idPrefix: string;
  accepted: boolean;
  onAcceptedChange: (accepted: boolean) => void;
  /** Adjusts the short helper line under the checkbox. */
  context?: "subscription" | "signup";
  className?: string;
};

/**
 * Collapsible full terms + required checkbox. Parent should disable submit until `accepted`.
 */
export function TermsAcceptance({
  idPrefix,
  accepted,
  onAcceptedChange,
  context = "subscription",
  className,
}: TermsAcceptanceProps) {
  const [open, setOpen] = React.useState<string | undefined>(undefined);
  const checkboxId = `${idPrefix}-terms-checkbox`;

  const expandTerms = React.useCallback(() => {
    setOpen(ACCORDION_VALUE);
  }, []);

  return (
    <div
      className={cn(
        "rounded-xl border border-white/15 bg-[#0a0a0a]/95 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-5",
        className
      )}
    >
      <Accordion type="single" collapsible value={open} onValueChange={setOpen}>
        <AccordionItem value={ACCORDION_VALUE} className="border-0">
          <AccordionTrigger className="rounded-lg px-1 py-3 font-gotham text-sm text-white hover:bg-white/8 hover:no-underline md:py-3.5">
            <span className="flex flex-col items-start gap-0.5 pr-3 text-left">
              <span className="font-semibold tracking-tight text-white">Terms and Conditions</span>
              <span className="text-xs font-normal text-white/70">Last updated: {TERMS_LAST_UPDATED_LABEL}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-1">
            <div
              className={cn(
                "max-h-[min(52vh,28rem)] overflow-y-auto overscroll-y-contain rounded-lg border border-white/12",
                "bg-[#050505]/95 p-4 sm:p-5",
                "[scrollbar-width:thin] [scrollbar-color:rgba(251,254,39,0.35)_transparent]"
              )}
            >
              <TermsAndConditionsBody />
            </div>
            <p className="mt-3 font-gotham text-xs leading-snug text-white/72">
              Full legal text is also on our{" "}
              <Link prefetch={false} href="/terms" className="font-medium text-escobets-yellow underline hover:text-[#f5f877]">
                Terms page
              </Link>{" "}
              for printing or sharing.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-4 flex gap-3 border-t border-white/10 pt-4">
        <Checkbox
          id={checkboxId}
          checked={accepted}
          onCheckedChange={(c) => onAcceptedChange(Boolean(c))}
          className="mt-0.5 border-white/70 accent-escobets-yellow"
          aria-describedby={`${checkboxId}-desc`}
        />
        <div className="min-w-0 flex-1">
          <label htmlFor={checkboxId} className="cursor-pointer font-gotham text-sm font-normal leading-snug text-white/92">
            I have read and agree to the{" "}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                expandTerms();
              }}
              className="font-medium text-escobets-yellow underline decoration-escobets-yellow/55 underline-offset-[3px] hover:text-[#f5f877] hover:decoration-escobets-yellow"
            >
              Terms and Conditions
            </button>
            .
          </label>
          <p id={`${checkboxId}-desc`} className="mt-1.5 font-gotham text-xs leading-snug text-white/70">
            {context === "signup"
              ? "Expand the terms above to read them. The checkbox confirms you agree before creating an account."
              : "Expand the terms above to read them. The checkbox confirms your agreement before you subscribe."}
          </p>
        </div>
      </div>
    </div>
  );
}
