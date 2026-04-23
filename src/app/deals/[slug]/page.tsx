import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { findDealBySlug } from "@/lib/site-settings/find-deal";
import { getSiteSettings } from "@/lib/site-settings/get-site-settings";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSiteSettings();
  const deal = findDealBySlug(site.deals, slug);
  if (!deal) {
    return { title: "Deal — EscoBets" };
  }
  return {
    title: `${deal.title} — EscoBets`,
    description: deal.body.split(/\n/)[0]?.slice(0, 160) ?? `EscoBets: ${deal.title}`,
  };
}

export default async function DealDetailPage({ params }: Props) {
  const { slug } = await params;
  const site = await getSiteSettings();
  const deal = findDealBySlug(site.deals, slug);

  if (!deal) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <main className="flex-1 px-4 py-10 md:py-14">
        <article className="mx-auto max-w-3xl">
          <p className="font-gotham text-xs font-medium uppercase tracking-[0.2em] text-escobets-yellow/90">
            Deal
          </p>
          <h1 className="mt-2 font-gotham text-3xl font-bold text-white md:text-4xl">{deal.title}</h1>
          <p className="mt-2 font-gotham text-sm text-white/50">{deal.date}</p>

          <div className="relative mt-8 aspect-[16/9] w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={deal.image}
              alt={deal.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 42rem"
              priority
            />
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 md:p-10">
            <div className="whitespace-pre-line font-gotham text-sm font-light leading-relaxed text-white/80">
              {deal.body}
            </div>
          </div>

          <p className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center font-gotham text-sm text-white/60">
            <Link prefetch={false} href="/deals" className="text-escobets-yellow hover:underline">
              All deals
            </Link>
            <span className="text-white/30" aria-hidden>
              ·
            </span>
            <Link prefetch={false} href="/" className="text-escobets-yellow hover:underline">
              Home
            </Link>
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
