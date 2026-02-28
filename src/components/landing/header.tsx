"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/news", label: "News" },
  { href: "/profit-tracker", label: "Profit Tracker" },
  { href: "/subscription", label: "Subscription" },
  { href: "/account", label: "Account" },
  { href: "/users", label: "Users" },
];

const linkStyle = {
  color: "#FFF",
  fontFamily: "Gotham, system-ui, sans-serif",
  fontSize: "1.16669rem",
  fontStyle: "normal" as const,
  fontWeight: 300,
  lineHeight: "2.66669rem",
};

const navLinkStyle = { fontFamily: linkStyle.fontFamily, fontSize: linkStyle.fontSize, fontStyle: linkStyle.fontStyle, fontWeight: linkStyle.fontWeight, lineHeight: linkStyle.lineHeight };
const navLinkStyleCompact = { ...navLinkStyle };

const loginButtonTextStyle = { ...linkStyle, color: "#FBFE27" };

type HeaderProps = {
  /** When true, shows logo on desktop (left side) for inner pages like login. Mobile unchanged. */
  variant?: "landing" | "withLogo";
};

export function Header({ variant = "landing" }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const showLogoOnDesktop = variant === "withLogo";

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="z-50 w-full bg-black px-4 py-4 md:bg-transparent md:px-6">
      <div
        className={cn(
          "relative mx-auto flex w-full items-center gap-4",
          showLogoOnDesktop ? "max-w-full min-[730px]:gap-6" : "max-w-full"
        )}
      >
        {/* Logo - hidden on desktop for landing; shown for withLogo. Hidden when mobile menu open. */}
        <Link
          href="/"
          className={cn(
            "flex shrink-0 items-center transition-opacity duration-200",
            "max-[729px]:flex",
            mobileOpen && "max-[729px]:hidden",
            showLogoOnDesktop ? "min-[730px]:flex" : "min-[730px]:hidden"
          )}
          aria-label="EscoBets home"
        >
          <Image
            src="/images/EscoBets_Logo.svg"
            alt="EscoBets"
            width={120}
            height={32}
            className="h-8 w-auto"
            style={{ width: "auto", height: "auto" }}
          />
        </Link>

        {/* Wrapper - center nav bar for landing, different layout for withLogo */}
        <div
          className={cn(
            "flex-1 min-[730px]:min-w-0 flex justify-end min-[730px]:justify-center",
            showLogoOnDesktop && "min-[730px]:justify-center"
          )}
        >
        {/* Nav bar - black on mobile. Desktop: exact spec for both variants. */}
        <div
          className={cn(
            "relative overflow-hidden",
            "rounded-[1.58331rem] border-[1.333px] border-white/[0.05] backdrop-blur-[13.33px]",
            "bg-black min-[730px]:bg-[#141414]",
            showLogoOnDesktop
              ? "min-[730px]:w-full min-[730px]:max-w-[46.25rem] min-[730px]:flex min-[730px]:flex-1"
              : "min-[730px]:flex min-[730px]:flex-col min-[730px]:items-center min-[730px]:justify-center min-[730px]:w-[46.25rem] min-[730px]:max-w-[46.25rem]",
            "max-[729px]:border-0 max-[729px]:rounded-xl max-[729px]:bg-transparent max-[729px]:backdrop-blur-0"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between p-0 min-[730px]:gap-6 w-full min-[730px]:flex-row min-[730px]:p-[0.83331rem_0.83581rem] min-[730px]:self-stretch min-[730px]:box-border"
            )}
            style={showLogoOnDesktop ? { minHeight: "5.02083rem" } : undefined}
          >
            <nav
              className="hidden min-w-0 flex-1 items-center justify-center gap-6 min-[730px]:flex"
              aria-label="Main"
            >
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="whitespace-nowrap shrink-0 font-light text-[#FFF] transition-colors hover:text-escobets-yellow hover:font-bold active:text-escobets-yellow active:font-bold"
                  style={showLogoOnDesktop ? navLinkStyle : navLinkStyleCompact}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2 min-[730px]:items-stretch max-[729px]:ml-auto">
              <div className="hidden min-[730px]:block">
                <Button
                  variant="outline"
                  asChild
                  className="h-full min-h-0 box-border flex max-w-[46.08331rem] flex-col items-start justify-center rounded-[0.83331rem] border-[1.333px] border-[#FBFE27] bg-transparent py-1 px-7 hover:bg-[#FBFE27]/10"
                >
                  <Link
                    href="/login"
                    className="flex h-full w-full min-w-0 flex-col items-start justify-center rounded-[0.83331rem] font-normal"
                    style={loginButtonTextStyle}
                  >
                    Log In
                  </Link>
                </Button>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen((o) => !o)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#FFF] hover:bg-white/10 hover:text-escobets-yellow min-[730px]:hidden transition-colors"
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel - full overlay when open */}
        <div
          className={cn(
            "fixed inset-0 top-0 left-0 right-0 z-40 min-[730px]:hidden",
            "bg-black/98 backdrop-blur-md",
            "flex flex-col px-6 pt-20 pb-8",
            "transition-all duration-300 ease-out",
            mobileOpen ? "opacity-100 pointer-events-auto visible" : "opacity-0 pointer-events-none invisible"
          )}
          aria-hidden={!mobileOpen}
        >
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-xl text-white hover:bg-white/10 hover:text-escobets-yellow transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
            <nav
            className="flex flex-1 flex-col justify-center gap-6"
            aria-label="Main mobile"
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-5 py-4 text-lg font-light text-[#FFF] transition-colors hover:bg-white/10 hover:text-escobets-yellow hover:font-bold active:text-escobets-yellow active:font-bold"
                style={{ fontFamily: linkStyle.fontFamily, fontSize: linkStyle.fontSize, fontStyle: linkStyle.fontStyle, fontWeight: linkStyle.fontWeight, lineHeight: linkStyle.lineHeight }}
              >
                {label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                asChild
                className="box-border flex w-full max-w-[46.08331rem] flex-col items-start justify-center rounded-[0.83331rem] border-[1.333px] border-[#FBFE27] bg-transparent py-1 px-7 hover:bg-[#FBFE27]/10"
              >
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full min-w-0 flex-col items-start justify-center rounded-[0.83331rem] font-normal"
                  style={loginButtonTextStyle}
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
