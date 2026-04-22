import type { SiteSettingsPayload } from "@/types/site-settings";
import { SEED_MANUAL_X_CARDS } from "./seed-manual-x-cards";

export const DEFAULT_SITE_SETTINGS: SiteSettingsPayload = {
  hero: {
    headlineBefore: "Elite Telegram Betting",
    highlightWord: "Insights",
    subheadline: "High-Confidence Picks. Proven Data. Real Results.",
    ctaLabel: "Join Now",
    ctaHref: "/subscription",
    footnote:
      "Exclusive picks, detailed analysis, and transparent profit/loss tracking",
  },
  promoBanner: {
    imageSrc: "/images/Ad.png",
  },
  xFeed: {
    /** Without @ is fine; shown in admin. Home page loads this user’s timeline when `X_BEARER_TOKEN` is set. */
    handle: "DeksneViktorija",
    /** When true, show a short “integration” note above the carousel. */
    comingSoon: false,
    /** Shown for new projects and when the DB payload has no `manualCards` key yet. */
    manualCards: SEED_MANUAL_X_CARDS,
  },
  pricing: {
    sectionSub: "No hidden fees. No complicated tiers. Switch between GBP and EUR below.",
    monthly: {
      badge: "Monthly",
      pricePerMonth: 20,
      pricePerMonthEur: 24,
      title: "Monthly plan",
      description:
        "Flexible, cancel anytime. Just elite betting insights for one low monthly fee.",
    },
    annual: {
      badge: "Annual",
      pricePerMonth: 16,
      pricePerMonthEur: 19,
      title: "Annual plan",
      description: "Our best per-month rate when you pay for 12 months upfront. Same full access to picks, P&L, and Telegram.",
      billedTotal: 192,
      billedTotalEur: 228,
    },
  },
  deals: [
    {
      title: "Giveaway & Gifts",
      date: "10/10/2026",
      image: "/images/newDeals/Image.png",
      href: "/deals",
    },
    {
      title: "Buy One, Get One",
      date: "10/11/2026",
      image: "/images/newDeals/Image-1.png",
      href: "/deals",
    },
    {
      title: "Referral Program",
      date: "20/9/2026",
      image: "/images/newDeals/Image-2.png",
      href: "/deals",
    },
  ],
  faq: {
    intro:
      "We're gonna say it — these aren't frequently asked, but we've added them here in case you were wondering.",
    items: [
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
    ],
  },
};
