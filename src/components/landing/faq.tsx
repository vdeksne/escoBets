"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
  {
    q: "What betting markets do you cover?",
    a: "We cover major football leagues, international tournaments, and select other sports. Our focus is on markets where we have proven edge and transparent tracking.",
  },
  {
    q: "How often are tips posted?",
    a: "High-confidence tips are posted daily in our private Telegram channel. You get priority notifications so you never miss a pick.",
  },
  {
    q: "How accurate are your tips?",
    a: "We publish full P&L and track every pick. Our dashboard shows real results—no cherry-picking. Accuracy varies by market; we focus on long-term value.",
  },
  {
    q: "Can I pause or cancel my subscription?",
    a: "Yes. You can pause or cancel anytime from your account. No long-term commitment required.",
  },
  {
    q: "What is the referral program?",
    a: "Refer friends and earn rewards when they subscribe. Details and tiers are available in your account dashboard.",
  },
  {
    q: "Do you offer 24/7 consultations?",
    a: "Premium members get access to our consultation channel for strategy and bankroll questions. This is a new feature we're rolling out.",
  },
];

export function FAQ() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-2 text-center text-3xl font-bold md:text-4xl">
          Frequently asked{" "}
          <span className="text-escobets-yellow">questions</span>
        </h2>
        <p className="mb-10 text-center text-white/70">
          {"We're"} gonna say it — these {"aren't"} frequently asked, but {"we've"}{" "}
          added them here in case you were wondering.
        </p>
        <Accordion type="single" collapsible className="space-y-2">
          {items.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-lg border border-white/10 bg-escobets-gray-card px-4"
            >
              <AccordionTrigger className="text-left hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
