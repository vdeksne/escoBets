"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Check, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { SiteImageUrlField } from "@/components/admin/site-image-url-field";
import { XManualCardsEditor } from "@/components/admin/x-manual-cards-editor";
import type { SiteSettingsPayload, SiteDeal, SiteFaqItem } from "@/types/site-settings";

/** Black-first admin: fields on true black; nested groups use zinc-950 as a subtle darker gray. */
const inputOverride =
  "h-9 rounded-lg border border-white/15 bg-black px-3 py-2 text-sm font-light text-white shadow-none !border-white/15 placeholder:text-white/40 " +
  "focus:border-escobets-yellow/45 focus:outline-none focus:ring-1 focus:ring-escobets-yellow/20";

const textareaClass =
  "min-h-[72px] w-full rounded-lg border border-white/15 bg-black px-3 py-2.5 text-sm font-light text-white shadow-none " +
  "placeholder:text-white/40 focus:border-escobets-yellow/45 focus:outline-none focus:ring-1 focus:ring-escobets-yellow/20";

function labelClass() {
  return "mb-1.5 block font-gotham text-[11px] font-normal uppercase tracking-wider text-white/50";
}

const sectionTitleTypography =
  "font-gotham text-xs font-medium uppercase tracking-wider text-white/60";

function sectionTitleClass() {
  return cn("mb-3", sectionTitleTypography);
}

function sectionShell(
  i: number,
  children: ReactNode,
  className?: string
) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] bg-black p-4 motion-safe:animate-admin-in md:p-5",
        className
      )}
      style={i > 0 ? { animationDelay: `${i * 50}ms` } : undefined}
    >
      {children}
    </div>
  );
}

type Props = {
  initial: SiteSettingsPayload;
};

export function SiteSettingsForm({ initial }: Props) {
  const [data, setData] = useState<SiteSettingsPayload>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  const patch = <K extends keyof SiteSettingsPayload>(key: K, value: SiteSettingsPayload[K]) => {
    setData((d) => ({ ...d, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as
        | { success: true; data: SiteSettingsPayload }
        | { success: false; error: { message: string } };
      if (!res.ok || !("success" in json) || !json.success) {
        setMessage({
          type: "err",
          text:
            (json as { error?: { message: string } }).error?.message ?? "Save failed.",
        });
        return;
      }
      setData(json.data);
      setMessage({ type: "ok", text: "Saved. Changes appear on the home page after refresh." });
    } catch {
      setMessage({ type: "err", text: "Network error. Try again." });
    } finally {
      setSaving(false);
    }
  };

  const addDeal = () => {
    setData((d) => ({
      ...d,
      deals: [
        ...d.deals,
        {
          title: "New deal",
          date: "",
          image: "/images/newDeals/Image.png",
          href: "/deals",
        } satisfies SiteDeal,
      ],
    }));
  };

  const updateDeal = (index: number, next: Partial<SiteDeal>) => {
    setData((d) => {
      const deals = d.deals.map((item, j) => (j === index ? { ...item, ...next } : item));
      return { ...d, deals };
    });
  };

  const removeDeal = (index: number) => {
    setData((d) => ({
      ...d,
      deals: d.deals.filter((_, j) => j !== index),
    }));
  };

  const addFaq = () => {
    setData((d) => ({
      ...d,
      faq: {
        ...d.faq,
        items: [...d.faq.items, { q: "New question", a: "Answer" } satisfies SiteFaqItem],
      },
    }));
  };

  const updateFaq = (index: number, next: Partial<SiteFaqItem>) => {
    setData((d) => {
      const items = d.faq.items.map((it, j) => (j === index ? { ...it, ...next } : it));
      return { ...d, faq: { ...d.faq, items } };
    });
  };

  const removeFaq = (index: number) => {
    setData((d) => ({
      ...d,
      faq: { ...d.faq, items: d.faq.items.filter((_, j) => j !== index) },
    }));
  };

  return (
    <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <nav
          className="mb-2 font-gotham text-xs text-white/45"
          aria-label="Breadcrumb"
        >
          <Link
            href="/admin"
            className="text-white/60 transition hover:text-escobets-yellow"
          >
            Control centre
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-white/80">Main page</span>
        </nav>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-gotham text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
              Main page
            </h1>
            <p className="mt-1.5 max-w-2xl font-gotham text-sm font-light leading-relaxed text-white/60">
              Edit the public home page. Save to update what visitors see (cached views may
              need a hard refresh).
            </p>
          </div>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border-2 border-escobets-yellow bg-transparent px-4 py-2 font-gotham text-sm font-medium text-escobets-yellow transition hover:bg-escobets-yellow/10 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : (
              <Save className="h-4 w-4 shrink-0" />
            )}
            Save
          </button>
        </div>

        {message && (
          <div
            className={cn(
              "mb-5 flex items-start gap-2 rounded-lg border px-3 py-2.5 font-gotham text-sm font-light",
              message.type === "ok"
                ? "border-escobets-yellow/30 bg-black text-escobets-yellow/90"
                : "border-red-500/30 bg-black text-red-200/90"
            )}
            role="status"
          >
            {message.type === "ok" && <Check className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
            {message.text}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {sectionShell(
            0,
            <>
              <h2 className={sectionTitleClass()}>Hero</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label className={labelClass()} htmlFor="hero-before">
                    Headline (before highlight)
                  </label>
                  <Input
                    className={inputOverride}
                    id="hero-before"
                    value={data.hero.headlineBefore}
                    onChange={(e) =>
                      patch("hero", { ...data.hero, headlineBefore: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={labelClass()} htmlFor="hero-highlight">
                    Highlight word
                  </label>
                  <Input
                    className={inputOverride}
                    id="hero-highlight"
                    value={data.hero.highlightWord}
                    onChange={(e) =>
                      patch("hero", { ...data.hero, highlightWord: e.target.value })
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass()} htmlFor="hero-sub">
                    Subheadline
                  </label>
                  <Input
                    className={inputOverride}
                    id="hero-sub"
                    value={data.hero.subheadline}
                    onChange={(e) =>
                      patch("hero", { ...data.hero, subheadline: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={labelClass()} htmlFor="hero-cta">
                    CTA label
                  </label>
                  <Input
                    className={inputOverride}
                    id="hero-cta"
                    value={data.hero.ctaLabel}
                    onChange={(e) =>
                      patch("hero", { ...data.hero, ctaLabel: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={labelClass()} htmlFor="hero-cta-href">
                    CTA link
                  </label>
                  <Input
                    className={inputOverride}
                    id="hero-cta-href"
                    value={data.hero.ctaHref}
                    onChange={(e) =>
                      patch("hero", { ...data.hero, ctaHref: e.target.value })
                    }
                    placeholder="/subscription"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass()} htmlFor="hero-foot">
                    Footnote
                  </label>
                  <textarea
                    id="hero-foot"
                    className={textareaClass}
                    value={data.hero.footnote}
                    onChange={(e) =>
                      patch("hero", { ...data.hero, footnote: e.target.value })
                    }
                    rows={2}
                  />
                </div>
              </div>
            </>
          )}

          {sectionShell(
            1,
            <>
              <h2 className={sectionTitleClass()}>Promo / big image</h2>
              <p className="mb-3 font-gotham text-sm font-light leading-relaxed text-white/50">
                Upload from your computer (stored in Supabase), or paste a path under{" "}
                <code className="rounded bg-zinc-950 px-1 text-[0.8rem] text-white/60">/public</code> or another
                allowed image URL.
              </p>
              <SiteImageUrlField
                id="promo-img"
                label="Image"
                value={data.promoBanner.imageSrc}
                onUrlChange={(url) => patch("promoBanner", { imageSrc: url })}
                inputClassName={inputOverride}
                labelClassName={labelClass()}
              />
            </>
          )}

          {sectionShell(
            2,
            <>
              <h2 className={sectionTitleClass()}>X (Twitter)</h2>
              <p className="mb-2 font-gotham text-sm font-light leading-relaxed text-white/50">
                The carousel uses the X API v2 (server-side). Enter the account handle below (with or
                without <code className="text-escobets-yellow/80">@</code>). For real posts you need
                an app-only <strong className="font-medium text-white/70">Bearer</strong> token in
                the environment as{" "}
                <code className="text-escobets-yellow/80">X_BEARER_TOKEN</code> — see{" "}
                <code className="text-escobets-yellow/80">.env.local.example</code>. After changing
                env vars, restart the dev server and redeploy production; the feed is cached for a
                few minutes.
              </p>
              <ol className="mb-3 list-decimal space-y-1 pl-5 font-gotham text-sm font-light leading-relaxed text-white/45">
                <li>
                  <a
                    href="https://developer.x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-escobets-yellow/85 underline decoration-escobets-yellow/35 underline-offset-2 hover:text-escobets-yellow"
                  >
                    developer.x.com
                  </a>
                  : create a Project and App → Keys and tokens → Bearer token (OAuth 2.0 App-only).
                </li>
                <li>
                  Your project must be allowed to call user lookup and user tweet timeline (X may
                  require a paid API access level — check the portal if you get 403 in the server
                  logs).
                </li>
                <li>
                  Put <code className="text-escobets-yellow/75">X_BEARER_TOKEN=…</code> in{" "}
                  <code className="text-escobets-yellow/75">.env.local</code> locally and in the
                  host’s env (e.g. Vercel → Settings → Environment Variables).
                </li>
              </ol>
              <div className="mb-2 flex items-start gap-3">
                <Checkbox
                  id="x-soon"
                  checked={data.xFeed.comingSoon}
                  onCheckedChange={(checked) =>
                    patch("xFeed", { ...data.xFeed, comingSoon: Boolean(checked) })
                  }
                  className="mt-0.5"
                />
                <div>
                  <label htmlFor="x-soon" className="font-gotham text-sm font-light text-white/60">
                    Softer “coming soon” message on the home page
                  </label>
                  <p className="mt-1 font-gotham text-xs font-light leading-relaxed text-white/40">
                    When the API is not returning posts yet: if this is on, visitors see a short
                    friendly line about the feed; if it is off, they see the technical hint about{" "}
                    <code className="text-escobets-yellow/70">X_BEARER_TOKEN</code>. Preview cards
                    still show so the section is not empty. Turn this off once the live posts load.
                  </p>
                </div>
              </div>
              <div>
                <label className={labelClass()} htmlFor="x-handle">
                  Handle
                </label>
                <Input
                  className={inputOverride}
                  id="x-handle"
                  value={data.xFeed.handle}
                  onChange={(e) =>
                    patch("xFeed", { ...data.xFeed, handle: e.target.value })
                  }
                  placeholder="@YourBrand or YourBrand"
                />
              </div>
              <XManualCardsEditor
                cards={data.xFeed.manualCards}
                siteXHandle={data.xFeed.handle}
                onChange={(manualCards) => patch("xFeed", { ...data.xFeed, manualCards })}
                inputOverrideClass={inputOverride}
              />
            </>
          )}

          {sectionShell(
            3,
            <>
              <h2 className={sectionTitleClass()}>Pricing</h2>
              <div>
                <label className={labelClass()} htmlFor="price-sub">
                  Section subtitle
                </label>
                <Input
                  className={inputOverride}
                  id="price-sub"
                  value={data.pricing.sectionSub}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      pricing: { ...d.pricing, sectionSub: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-2.5 rounded-lg border border-white/[0.06] bg-zinc-950 p-3">
                  <p className="font-gotham text-xs font-medium uppercase tracking-wider text-escobets-yellow/85">
                    Monthly plan
                  </p>
                  <div>
                    <label className={labelClass()}>Badge</label>
                    <Input
                      className={inputOverride}
                      value={data.pricing.monthly.badge}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          pricing: {
                            ...d.pricing,
                            monthly: { ...d.pricing.monthly, badge: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass()}>Price / month (GBP)</label>
                    <Input
                      className={inputOverride}
                      type="number"
                      min={0}
                      step={1}
                      value={data.pricing.monthly.pricePerMonth}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          pricing: {
                            ...d.pricing,
                            monthly: {
                              ...d.pricing.monthly,
                              pricePerMonth: Number(e.target.value) || 0,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass()}>Price / month (EUR)</label>
                    <Input
                      className={inputOverride}
                      type="number"
                      min={0}
                      step={1}
                      value={data.pricing.monthly.pricePerMonthEur}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          pricing: {
                            ...d.pricing,
                            monthly: {
                              ...d.pricing.monthly,
                              pricePerMonthEur: Number(e.target.value) || 0,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass()}>Title</label>
                    <Input
                      className={inputOverride}
                      value={data.pricing.monthly.title}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          pricing: {
                            ...d.pricing,
                            monthly: { ...d.pricing.monthly, title: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass()}>Description</label>
                    <textarea
                      className={textareaClass}
                      rows={3}
                      value={data.pricing.monthly.description}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          pricing: {
                            ...d.pricing,
                            monthly: {
                              ...d.pricing.monthly,
                              description: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2.5 rounded-lg border border-white/[0.06] bg-zinc-950 p-3">
                  <p className="font-gotham text-xs font-medium uppercase tracking-wider text-escobets-yellow/85">
                    Annual (yearly billing)
                  </p>
                  <div>
                    <label className={labelClass()}>Badge</label>
                    <Input
                      className={inputOverride}
                      value={data.pricing.annual.badge}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          pricing: {
                            ...d.pricing,
                            annual: { ...d.pricing.annual, badge: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass()}>Price / month (GBP, equivalent)</label>
                    <Input
                      className={inputOverride}
                      type="number"
                      min={0}
                      step={1}
                      value={data.pricing.annual.pricePerMonth}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          pricing: {
                            ...d.pricing,
                            annual: {
                              ...d.pricing.annual,
                              pricePerMonth: Number(e.target.value) || 0,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass()}>Price / month (EUR, equivalent)</label>
                    <Input
                      className={inputOverride}
                      type="number"
                      min={0}
                      step={1}
                      value={data.pricing.annual.pricePerMonthEur}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          pricing: {
                            ...d.pricing,
                            annual: {
                              ...d.pricing.annual,
                              pricePerMonthEur: Number(e.target.value) || 0,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass()}>Billed total per year (GBP, reference)</label>
                    <Input
                      className={inputOverride}
                      type="number"
                      min={0}
                      step={1}
                      value={data.pricing.annual.billedTotal ?? 0}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          pricing: {
                            ...d.pricing,
                            annual: {
                              ...d.pricing.annual,
                              billedTotal: Number(e.target.value) || 0,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass()}>Billed total per year (EUR, reference)</label>
                    <Input
                      className={inputOverride}
                      type="number"
                      min={0}
                      step={1}
                      value={data.pricing.annual.billedTotalEur ?? 0}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          pricing: {
                            ...d.pricing,
                            annual: {
                              ...d.pricing.annual,
                              billedTotalEur: Number(e.target.value) || 0,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass()}>Title</label>
                    <Input
                      className={inputOverride}
                      value={data.pricing.annual.title}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          pricing: {
                            ...d.pricing,
                            annual: { ...d.pricing.annual, title: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass()}>Description</label>
                    <textarea
                      className={textareaClass}
                      rows={3}
                      value={data.pricing.annual.description}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          pricing: {
                            ...d.pricing,
                            annual: {
                              ...d.pricing.annual,
                              description: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {sectionShell(
            4,
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className={sectionTitleTypography}>New deals</h2>
                <button
                  type="button"
                  onClick={addDeal}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-zinc-950 px-3 py-1.5 font-gotham text-sm font-medium text-white/80 transition hover:bg-zinc-900"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add deal
                </button>
              </div>
              <ul className="flex flex-col gap-3">
                {data.deals.map((deal, index) => (
                  <li
                    key={index}
                    className="rounded-lg border border-white/[0.06] bg-zinc-950 p-3 transition hover:border-white/10"
                  >
                    <div className="mb-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeDeal(index)}
                        className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-red-300"
                        aria-label="Remove deal"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className={labelClass()}>Title</label>
                        <Input
                          className={inputOverride}
                          value={deal.title}
                          onChange={(e) => updateDeal(index, { title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className={labelClass()}>Date (display)</label>
                        <Input
                          className={inputOverride}
                          value={deal.date}
                          onChange={(e) => updateDeal(index, { date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className={labelClass()}>Link</label>
                        <Input
                          className={inputOverride}
                          value={deal.href}
                          onChange={(e) => updateDeal(index, { href: e.target.value })}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <SiteImageUrlField
                          id={`deal-img-${index}`}
                          label="Image"
                          value={deal.image}
                          onUrlChange={(url) => updateDeal(index, { image: url })}
                          inputClassName={inputOverride}
                          labelClassName={labelClass()}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {sectionShell(
            5,
            <>
              <h2 className={sectionTitleClass()}>FAQ</h2>
              <div className="mb-4">
                <label className={labelClass()} htmlFor="faq-intro">
                  Intro
                </label>
                <textarea
                  id="faq-intro"
                  className={textareaClass}
                  rows={3}
                  value={data.faq.intro}
                  onChange={(e) =>
                    setData((d) => ({ ...d, faq: { ...d.faq, intro: e.target.value } }))
                  }
                />
              </div>
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={addFaq}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-zinc-950 px-3 py-1.5 font-gotham text-sm font-medium text-white/80 transition hover:bg-zinc-900"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add question
                </button>
              </div>
              <ul className="flex flex-col gap-3">
                {data.faq.items.map((item, index) => (
                  <li
                    key={index}
                    className="rounded-lg border border-white/[0.06] bg-zinc-950 p-3"
                  >
                    <div className="mb-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeFaq(index)}
                        className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-red-300"
                        aria-label="Remove FAQ item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <label className={labelClass()}>Question</label>
                      <Input
                        className={cn(inputOverride, "mb-1.5")}
                        value={item.q}
                        onChange={(e) => updateFaq(index, { q: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={labelClass()}>Answer</label>
                      <textarea
                        className={textareaClass}
                        rows={4}
                        value={item.a}
                        onChange={(e) => updateFaq(index, { a: e.target.value })}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
