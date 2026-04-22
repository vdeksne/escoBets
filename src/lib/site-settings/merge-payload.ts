import type { SiteSettingsPayload } from "@/types/site-settings";
import { DEFAULT_SITE_SETTINGS } from "./defaults";
import { mergeManualXCards } from "./merge-manual-x-cards";

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/** Deep merge partial JSON from DB with defaults. */
export function mergeSiteSettings(raw: unknown): SiteSettingsPayload {
  if (!isRecord(raw)) {
    return DEFAULT_SITE_SETTINGS;
  }
  const h = isRecord(raw.hero) ? raw.hero : {};
  const p = isRecord(raw.promoBanner) ? raw.promoBanner : {};
  const x = isRecord(raw.xFeed) ? raw.xFeed : {};
  const pr = isRecord(raw.pricing) ? raw.pricing : {};
  const pm = isRecord(pr.monthly) ? pr.monthly : {};
  const pa = isRecord(pr.annual) ? pr.annual : isRecord(pr.sprint) ? pr.sprint : {};
  const fq = isRecord(raw.faq) ? raw.faq : {};
  return {
    hero: {
      headlineBefore: typeof h.headlineBefore === "string" ? h.headlineBefore : DEFAULT_SITE_SETTINGS.hero.headlineBefore,
      highlightWord: typeof h.highlightWord === "string" ? h.highlightWord : DEFAULT_SITE_SETTINGS.hero.highlightWord,
      subheadline: typeof h.subheadline === "string" ? h.subheadline : DEFAULT_SITE_SETTINGS.hero.subheadline,
      ctaLabel: typeof h.ctaLabel === "string" ? h.ctaLabel : DEFAULT_SITE_SETTINGS.hero.ctaLabel,
      ctaHref: typeof h.ctaHref === "string" ? h.ctaHref : DEFAULT_SITE_SETTINGS.hero.ctaHref,
      footnote: typeof h.footnote === "string" ? h.footnote : DEFAULT_SITE_SETTINGS.hero.footnote,
    },
    promoBanner: {
      imageSrc: typeof p.imageSrc === "string" ? p.imageSrc : DEFAULT_SITE_SETTINGS.promoBanner.imageSrc,
    },
    xFeed: (() => {
      const hasManualKey =
        isRecord(x) && Object.prototype.hasOwnProperty.call(x, "manualCards");
      return {
        handle: typeof x.handle === "string" ? x.handle : DEFAULT_SITE_SETTINGS.xFeed.handle,
        comingSoon: typeof x.comingSoon === "boolean" ? x.comingSoon : DEFAULT_SITE_SETTINGS.xFeed.comingSoon,
        manualCards: hasManualKey
          ? mergeManualXCards(x.manualCards)
          : DEFAULT_SITE_SETTINGS.xFeed.manualCards,
      };
    })(),
    pricing: {
      sectionSub: typeof pr.sectionSub === "string" ? pr.sectionSub : DEFAULT_SITE_SETTINGS.pricing.sectionSub,
      monthly: {
        badge: typeof pm.badge === "string" ? pm.badge : DEFAULT_SITE_SETTINGS.pricing.monthly.badge,
        pricePerMonth: typeof pm.pricePerMonth === "number" && Number.isFinite(pm.pricePerMonth)
          ? pm.pricePerMonth
          : DEFAULT_SITE_SETTINGS.pricing.monthly.pricePerMonth,
        pricePerMonthEur: typeof pm.pricePerMonthEur === "number" && Number.isFinite(pm.pricePerMonthEur)
          ? pm.pricePerMonthEur
          : DEFAULT_SITE_SETTINGS.pricing.monthly.pricePerMonthEur,
        title: typeof pm.title === "string" ? pm.title : DEFAULT_SITE_SETTINGS.pricing.monthly.title,
        description: typeof pm.description === "string" ? pm.description : DEFAULT_SITE_SETTINGS.pricing.monthly.description,
      },
      annual: {
        badge: typeof pa.badge === "string" ? pa.badge : DEFAULT_SITE_SETTINGS.pricing.annual.badge,
        pricePerMonth: typeof pa.pricePerMonth === "number" && Number.isFinite(pa.pricePerMonth)
          ? pa.pricePerMonth
          : DEFAULT_SITE_SETTINGS.pricing.annual.pricePerMonth,
        pricePerMonthEur: typeof pa.pricePerMonthEur === "number" && Number.isFinite(pa.pricePerMonthEur)
          ? pa.pricePerMonthEur
          : DEFAULT_SITE_SETTINGS.pricing.annual.pricePerMonthEur,
        title: typeof pa.title === "string" ? pa.title : DEFAULT_SITE_SETTINGS.pricing.annual.title,
        description: typeof pa.description === "string" ? pa.description : DEFAULT_SITE_SETTINGS.pricing.annual.description,
        billedTotal: typeof pa.billedTotal === "number" && Number.isFinite(pa.billedTotal)
          ? pa.billedTotal
          : DEFAULT_SITE_SETTINGS.pricing.annual.billedTotal,
        billedTotalEur: typeof pa.billedTotalEur === "number" && Number.isFinite(pa.billedTotalEur)
          ? pa.billedTotalEur
          : DEFAULT_SITE_SETTINGS.pricing.annual.billedTotalEur,
      },
    },
    deals: (() => {
      if (!Array.isArray(raw.deals)) return DEFAULT_SITE_SETTINGS.deals;
      const m = raw.deals
        .filter(isRecord)
        .map((d) => ({
          title: typeof d.title === "string" ? d.title : "",
          date: typeof d.date === "string" ? d.date : "",
          image: typeof d.image === "string" ? d.image : "",
          href: typeof d.href === "string" ? d.href : "/deals",
        }))
        .filter((d) => d.title);
      return m.length > 0 ? m : DEFAULT_SITE_SETTINGS.deals;
    })(),
    faq: {
      intro: typeof fq.intro === "string" ? fq.intro : DEFAULT_SITE_SETTINGS.faq.intro,
      items: (() => {
        if (!Array.isArray(fq.items)) return DEFAULT_SITE_SETTINGS.faq.items;
        const m = fq.items
          .filter(isRecord)
          .map((it) => ({
            q: typeof it.q === "string" ? it.q : "",
            a: typeof it.a === "string" ? it.a : "",
          }))
          .filter((it) => it.q);
        return m.length > 0 ? m : DEFAULT_SITE_SETTINGS.faq.items;
      })(),
    },
  };
}
