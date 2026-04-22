"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings/defaults";
import type { SiteFaqItem } from "@/types/site-settings";

type FAQProps = {
  intro?: string;
  items?: SiteFaqItem[];
};

export function FAQ({
  intro = DEFAULT_SITE_SETTINGS.faq.intro,
  items = DEFAULT_SITE_SETTINGS.faq.items,
}: FAQProps) {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-2 text-center text-3xl font-bold md:text-4xl">
          Frequently asked{" "}
          <span
            className="text-[#FBFE27]"
            style={{ textShadow: "0 0 66.667px #FBFE27" }}
          >
            questions
          </span>
        </h2>
        <p className="mb-10 text-center text-white/70">
          {intro}
        </p>
        <Accordion type="single" collapsible className="flex flex-col items-center gap-4">
          {items.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="w-full max-w-[70rem] shrink-0 overflow-hidden rounded-[1.25rem] border border-b-0 border-white/[0.05] p-0 shadow-[50px_15px_80px_-20px_rgba(85,85,124,0.08)] backdrop-blur-[13px]"
              style={{
                background:
                  "linear-gradient(265deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
              }}
            >
              <AccordionTrigger className="min-h-[6.16669rem] px-11 py-[0.91669rem] text-left text-base font-bold text-white hover:no-underline hover:bg-transparent [&[data-state=open]]:bg-white/[0.02]">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="border-t border-white/[0.05] px-11 pb-6 pt-4 text-white/80">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
