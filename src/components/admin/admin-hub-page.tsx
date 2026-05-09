"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CreditCard,
  Home,
  LayoutDashboard,
  Megaphone,
  Users,
} from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { cn } from "@/lib/utils";

type AdminTile = {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  /** Emphasise primary entry points */
  featured?: boolean;
};

const tiles: AdminTile[] = [
  {
    href: "/updates",
    title: "News & predictions",
    description: "List, draft, and publish site news — create new posts and edit existing ones in one place.",
    icon: <Megaphone className="h-6 w-6" strokeWidth={1.75} />,
    featured: true,
  },
  {
    href: "/users",
    title: "Users",
    description: "View members, roles, and subscription-related status in one place.",
    icon: <Users className="h-6 w-6" strokeWidth={1.75} />,
    featured: true,
  },
  {
    href: "/admin/subscription",
    title: "Subscription",
    description: "Preview the public subscription funnel and form — same experience visitors see.",
    icon: <CreditCard className="h-6 w-6" strokeWidth={1.75} />,
    featured: true,
  },
  {
    href: "/admin/site",
    title: "Main page",
    description:
      "Hero copy, promo image, X feed link, pricing, deals, and FAQ for the public landing page.",
    icon: <Home className="h-6 w-6" strokeWidth={1.75} />,
    featured: true,
  },
];

export function AdminHubPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />

      <main className="flex-1 px-4 py-10 md:px-8 md:py-14">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-gotham text-xs text-white/60">
            <LayoutDashboard className="h-3.5 w-3.5 text-escobets-yellow" aria-hidden />
            Admin
          </div>
          <h1 className="mt-3 font-gotham text-3xl font-bold tracking-tight text-white md:text-4xl">
            Control centre
          </h1>
          <p className="mt-2 max-w-2xl font-gotham text-base text-white/55 md:text-lg">
            Choose a section to work in. More tools can be added here as the product grows.
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiles.map((tile) => (
              <li key={tile.href}>
                <Link
                  href={tile.href}
                  className={cn(
                    "group relative flex h-full min-h-[180px] flex-col rounded-2xl border p-6 transition",
                    "border-white/10 bg-gradient-to-b from-escobets-gray-card/90 to-black/40",
                    "hover:border-escobets-yellow/40 hover:shadow-lg hover:shadow-escobets-yellow/5",
                    tile.featured && "sm:ring-1 sm:ring-escobets-yellow/20"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-escobets-yellow">
                      {tile.icon}
                    </span>
                    <span className="rounded-full border border-white/10 p-1.5 text-white/40 transition group-hover:border-escobets-yellow/30 group-hover:text-escobets-yellow">
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                  <h2 className="mt-4 font-gotham text-lg font-semibold text-white group-hover:text-escobets-yellow">
                    {tile.title}
                  </h2>
                  <p className="mt-2 flex-1 font-gotham text-sm leading-relaxed text-white/50">
                    {tile.description}
                  </p>
                  <span className="mt-4 font-gotham text-xs font-medium uppercase tracking-wider text-white/35 group-hover:text-escobets-yellow/80">
                    Open →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
