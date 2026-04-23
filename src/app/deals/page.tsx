import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { dealPageHref } from "@/lib/site-settings/deal-href";
import { getSiteSettings } from "@/lib/site-settings/get-site-settings";

export const metadata: Metadata = {
  title: "Deals — EscoBets",
  description: "Current promotions, giveaways, and referral rewards for EscoBets members.",
};

export const revalidate = 60;

export default async function DealsIndexPage() {
  const site = await getSiteSettings();
  const deals = site.deals;

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <main className="flex-1 px-4 py-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          <p className="font-gotham text-xs font-medium uppercase tracking-[0.2em] text-escobets-yellow/90">
            Promotions
          </p>
          <h1 className="mt-2 font-gotham text-3xl font-bold text-white md:text-4xl">Deals</h1>
          <p className="mt-3 max-w-2xl font-gotham text-sm font-light leading-relaxed text-white/60">
            Active offers from the home page. Open a deal for full terms and how to qualify.
          </p>
          <ul className="mt-10 flex flex-col gap-4">
            {deals.map((deal, i) => {
              const href = dealPageHref(deal);
              const isExternal = /^https?:\/\//i.test(href);
              return (
                <li key={`${deal.slug}-${i}`}>
                  <Link
                    prefetch={false}
                    href={href}
                    {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-escobets-yellow/40 md:gap-6 md:p-5"
                  >
                    <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg md:h-28 md:w-44">
                      <Image
                        src={deal.image}
                        alt={deal.title}
                        fill
                        className="object-cover transition group-hover:scale-105"
                        sizes="176px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-gotham text-lg font-bold text-white transition group-hover:text-escobets-yellow md:text-xl">
                        {deal.title}
                      </h2>
                      <p className="mt-1 font-gotham text-sm text-white/50">{deal.date}</p>
                      <p className="mt-2 line-clamp-2 font-gotham text-sm font-light text-white/55">
                        {deal.body.split(/\n/)[0]?.trim() ?? "View details"}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-10 text-center font-gotham text-sm text-white/60">
            <Link prefetch={false} href="/" className="text-escobets-yellow hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
