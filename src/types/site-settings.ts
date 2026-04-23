export type SiteDeal = {
  title: string;
  date: string;
  image: string;
  /** Use `/deals/[slug]`, an external URL, or leave `/deals` to fall back to the slug. */
  href: string;
  /** URL segment for the public detail page, e.g. `giveaway` → `/deals/giveaway`. */
  slug: string;
  /** Long-form copy for `/deals/[slug]` (line breaks are preserved). */
  body: string;
};

export type SiteFaqItem = {
  q: string;
  a: string;
};

/** Editable copy for the landing pricing section. GBP is the primary reference; EUR for toggled display. */
export type SitePricingPlan = {
  badge: string;
  /** £/mo when GBP is selected. */
  pricePerMonth: number;
  /** €/mo when EUR is selected. */
  pricePerMonthEur: number;
  title: string;
  description: string;
  /** Annual total, GBP (reference if no consultation add-on). */
  billedTotal?: number;
  /** Annual total, EUR. */
  billedTotalEur?: number;
};

import type { XTweetCard } from "@/types/x-tweet";

export type SiteSettingsPayload = {
  hero: {
    headlineBefore: string;
    highlightWord: string;
    subheadline: string;
    ctaLabel: string;
    ctaHref: string;
    footnote: string;
  };
  /** Wide promo / “big image” (e.g. Ad.png or campaign art). */
  promoBanner: {
    imageSrc: string;
  };
  /** Public timeline on the home page (X API v2 + optional `X_BEARER_TOKEN`). */
  xFeed: {
    handle: string;
    /** Shown in admin + optional note on the site. */
    comingSoon: boolean;
    /**
     * Shown on the home page when the X API returns no posts (credits, errors, or missing token).
     * Does not override a successful API response.
     */
    manualCards: XTweetCard[];
  };
  pricing: {
    sectionSub: string;
    monthly: SitePricingPlan;
    /** Yearly / annual commitment (e.g. £/mo equivalent, billed once per year). */
    annual: SitePricingPlan;
  };
  deals: SiteDeal[];
  faq: {
    intro: string;
    items: SiteFaqItem[];
  };
};
