"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/news", label: "News" },
  { href: "/profit-tracker", label: "Profit Tracker" },
  { href: "/subscription", label: "Subscription" },
  { href: "/account", label: "Account" },
  { href: "/users", label: "Users" },
];

const linkStyle = {
  fontFamily: "Gotham, system-ui, sans-serif",
  fontSize: "1.16669rem",
  fontStyle: "normal" as const,
  lineHeight: "2.66669rem",
};

export function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="z-50 w-full bg-transparent px-4 py-4 md:px-6">
      <div className="relative mx-auto w-full max-w-[43rem] overflow-hidden rounded-2xl bg-[#1F1F1F]">
        <div className="flex items-stretch justify-between gap-3 px-3 py-3 min-[730px]:gap-6 min-[730px]:px-6 min-[730px]:py-4">
          <Link
            href="/"
            className="flex shrink-0 items-center min-[730px]:hidden"
            aria-label="EscoBets home"
          >
            <Image
              src="/images/EscoBets_Logo.svg"
              alt="EscoBets"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          <nav
            className="hidden min-w-0 shrink items-center gap-6 min-[730px]:flex"
            aria-label="Main"
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="whitespace-nowrap font-normal text-[#FFF] transition-colors hover:text-escobets-yellow"
                style={linkStyle}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 min-[730px]:items-stretch">
            <div className="hidden min-[730px]:block">
              <Button
                variant="outline"
                asChild
                className="h-full min-h-0 rounded-[0.83331rem] border-2 border-escobets-yellow px-5 box-border"
              >
                <Link
                  href="/login"
                  className="flex h-full items-center justify-center rounded-[0.83331rem] font-normal text-[#FFF] transition-colors hover:text-escobets-yellow"
                  style={linkStyle}
                >
                  Log In
                </Link>
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#FFF] hover:bg-white/10 hover:text-escobets-yellow min-[730px]:hidden"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <div
          className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out min-[730px]:hidden ${mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
          aria-hidden={!mobileOpen}
        >
          <div className="min-h-0 border-t border-white/10">
            <nav
              className="flex flex-col gap-1 px-4 py-4 pb-6"
              aria-label="Main mobile"
            >
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-3 font-normal text-[#FFF] transition-colors hover:bg-white/10 hover:text-escobets-yellow"
                  style={linkStyle}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t border-white/10">
                <Button variant="outline" asChild className="w-full rounded-[0.83331rem] border-2 border-escobets-yellow">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center py-3 font-normal text-[#FFF] transition-colors hover:text-escobets-yellow"
                    style={linkStyle}
                  >
                    Log In
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
