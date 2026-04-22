"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { hasAdminRole } from "@/lib/auth/admin";
import { cn } from "@/lib/utils";

const baseNavLinks = [
  { href: "/news", label: "News" },
  { href: "/profit-tracker", label: "Profit Tracker" },
  { href: "/subscription", label: "Subscription" },
  { href: "/account", label: "Account" },
];

const adminLink = { href: "/admin" as const, label: "Admin" as const };

function navLinksForUser(isAdmin: boolean) {
  if (!isAdmin) {
    return [...baseNavLinks];
  }
  // Staff: no Subscription; Admin then Account (same order as Figma, without Users in the bar)
  return [
    { href: "/news" as const, label: "News" },
    { href: "/profit-tracker" as const, label: "Profit Tracker" },
    adminLink,
    { href: "/account" as const, label: "Account" },
  ];
}

const BRAND_W = 120; // desktop: logo column; keeps header alignment stable

/** Figma: metrics only — default weight 100 (max thin), selected route uses 400. */
const navTextMetrics = {
  fontFamily: "Gotham, system-ui, sans-serif",
  fontSize: "1.13931rem",
  fontStyle: "normal" as const,
  lineHeight: "2.66669rem",
} as const;

/**
 * Figma: Log In / Log Out in the top nav (outline pill)
 * display flex; padding 0.25rem 1.75rem; border-radius 0.83331rem; border 1.333px solid #FBFE27
 * type: Gotham 1.15756rem / 400 / line-height 2.66669rem, white
 * Label is a single line — use row + center (not column + flex-start) so text sits in the pill.
 */
const authPillTextStyle: React.CSSProperties = {
  color: "#FFF",
  fontFamily: "Gotham, system-ui, sans-serif",
  fontSize: "1.15756rem",
  fontStyle: "normal",
  lineHeight: "2.66669rem",
  fontWeight: 100,
};

const authPillBaseClass = cn(
  "box-border inline-flex max-w-full shrink-0 items-center justify-center gap-0",
  "border-[0.333px] border-solid border-[#FBFE27] bg-transparent",
  "rounded-[0.83331rem] px-[1.75rem] py-1",
  "text-center",
  "hover:!bg-[#FBFE27]/10",
  "focus-visible:ring-0 focus-visible:ring-offset-0",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FBFE27]",
);

// const authPillTextStyle: React.CSSProperties = {
//   color: "#FFF",
//   fontFamily: "Gotham, system-ui, sans-serif",
//   fontSize: "1.05rem",
//   fontStyle: "normal",
//   lineHeight: 1.05,
//   fontWeight: 100,
//   letterSpacing: "0.02em",
// };

// const authPillBaseClass = cn(
//   "box-border inline-flex max-w-full shrink-0 items-center justify-center gap-0",
//   "border-[0.5px] border-solid border-[#FBFE27] bg-transparent",
//   "rounded-lg px-4 py-1.5",
//   "text-center antialiased",
//   "hover:!bg-[#FBFE27]/8",
//   "focus-visible:ring-0 focus-visible:ring-offset-0",
//   "focus-visible:outline focus-visible:outline-[0.5px] focus-visible:outline-offset-2 focus-visible:outline-[#FBFE27]",
// );

const navLinkStyle = (active: boolean): React.CSSProperties => ({
  ...navTextMetrics,
  fontWeight: active ? 400 : 100,
});

type HeaderProps = {
  /**
   * When false, desktop hides the small header logo (e.g. age gate where the page shows a large logo)
   * but the layout keeps the same width as when the logo is shown so the bar does not reflow.
   */
  showDesktopBrand?: boolean;
};

export function Header({ showDesktopBrand = true }: HeaderProps) {
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isAuthLoading, setIsAuthLoading] = React.useState(true);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));
  const navLinks = React.useMemo(() => navLinksForUser(isAdmin), [isAdmin]);

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  React.useEffect(() => {
    let alive = true;

    const loadAuthState = async () => {
      const { data: first } = await supabase.auth.getUser();
      if (!alive) return;
      let user = first.user;
      // Refresh JWT so `role: admin` in app_metadata (set in Supabase) appears without re-login
      if (user) {
        const { data: ref, error: refErr } =
          await supabase.auth.refreshSession();
        if (!refErr && ref.session?.user) {
          user = ref.session.user;
        }
      }
      if (!alive) return;
      setIsAuthenticated(Boolean(user));
      setIsAdmin(user ? hasAdminRole(user) : false);
      setIsAuthLoading(false);
    };

    void loadAuthState();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      setIsAuthenticated(Boolean(u));
      setIsAdmin(u ? hasAdminRole(u) : false);
      setIsAuthLoading(false);
    });

    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    setIsSigningOut(false);
    setMobileOpen(false);
    router.push("/login");
    router.refresh();
  };

  const linkClassName = cn(
    "shrink-0 whitespace-nowrap transition-colors",
    "hover:text-escobets-yellow active:text-escobets-yellow",
  );

  return (
    <header className="z-50 w-full bg-black px-4 py-4 md:bg-transparent md:px-6">
      <div
        className="relative mx-auto flex w-full max-w-[80rem] items-center gap-4"
        style={{ minHeight: "3.5rem" }}
      >
        {/* Mobile: show logo. Desktop: same-width column so the nav + auth do not move between pages. */}
        <div className="flex w-[120px] shrink-0 max-[729px]:w-auto max-[729px]:shrink-0">
          <Link
            prefetch={false}
            href="/"
            className={cn(
              "flex shrink-0 items-center transition-opacity duration-200",
              "max-[729px]:flex",
              mobileOpen && "max-[729px]:hidden",
              showDesktopBrand
                ? "min-[730px]:flex"
                : "min-[730px]:invisible min-[730px]:pointer-events-none",
            )}
            aria-label="EscoBets home"
            tabIndex={showDesktopBrand ? undefined : -1}
          >
            <Image
              src="/images/EscoBets_Logo.svg"
              alt="EscoBets"
              width={BRAND_W}
              height={32}
              priority
              className="h-8 w-auto"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
        </div>

        <div className="flex min-w-0 flex-1 max-[729px]:items-center max-[729px]:justify-end min-[730px]:items-stretch min-[730px]:justify-center">
          {/*
            Figma: flex, padding 0.83331rem 0.83581rem 0.83331rem 0.83331rem, space-between, items center, self stretch; compact pill.
          */}
          <div
            className={cn(
              "font-gotham",
              "hidden w-full min-w-0 min-[730px]:block",
              "min-[730px]:self-stretch",
              // One width for everyone: slightly under the old 40rem/48rem guest bar.
              "min-[730px]:max-w-[min(100%,38rem)] min-[780px]:max-w-[min(100%,46rem)]",
              "min-[780px]:flex min-[730px]:flex-col min-[730px]:overflow-x-auto [scrollbar-width:thin]",
              "min-[730px]:rounded-[1.58331rem] min-[730px]:border min-[730px]:border-[#262626]",
              "min-[730px]:bg-[#141414] min-[730px]:backdrop-blur-[13.33px]",
            )}
          >
            {/*
              Auth pill is position:absolute so it does not pull the link row off-center. End padding
              matches the reserved control width so the four links (guest) or four staff links
              (admin) are centered in the same visual window for Log In and Log Out.
            */}
            <nav
              className={cn(
                "relative w-full min-w-0",
                "py-[0.83331rem] pl-[0.83331rem] pr-[0.83581rem]",
              )}
              aria-label="Main"
            >
              <div
                className={cn(
                  "flex min-h-0 min-w-0 w-full max-w-full items-center justify-center",
                  "pr-[5.5rem] sm:pr-24",
                  "flex-nowrap",
                  "gap-x-2 min-[800px]:gap-x-2.5 min-[1000px]:gap-x-3 min-[1200px]:gap-x-4",
                  "overflow-x-auto overflow-y-hidden [scrollbar-width:thin]",
                )}
              >
                {navLinks.map(({ href, label }) => (
                  <Link
                    prefetch={false}
                    key={href}
                    href={href}
                    className={cn(
                      linkClassName,
                      isActive(href) ? "text-escobets-yellow" : "text-white",
                    )}
                    style={navLinkStyle(isActive(href))}
                  >
                    {label}
                  </Link>
                ))}
                {!isAdmin && isAuthenticated && (
                  <span
                    className="invisible pointer-events-none shrink-0 select-none"
                    aria-hidden
                    style={navLinkStyle(false)}
                  >
                    {adminLink.label}
                  </span>
                )}
              </div>
              <div className="absolute right-[0.83581rem] top-1/2 z-10 -translate-y-1/2">
                {isAuthenticated ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleLogout}
                    disabled={isSigningOut}
                    className={cn(
                      authPillBaseClass,
                      "h-auto min-h-0 w-auto shrink-0",
                    )}
                    style={authPillTextStyle}
                  >
                    {isSigningOut ? "…" : "Log Out"}
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    asChild
                    disabled={isAuthLoading}
                    className="h-auto min-h-0 shrink-0 p-0"
                  >
                    <Link
                      prefetch={false}
                      href="/login"
                      className={cn(
                        authPillBaseClass,
                        "w-auto text-white hover:text-escobets-yellow",
                      )}
                      style={authPillTextStyle}
                      aria-busy={isAuthLoading}
                    >
                      Log In
                    </Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>

          <div className="ml-auto flex min-[730px]:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white transition-colors hover:bg-white/10 hover:text-escobets-yellow"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "fixed inset-0 top-0 left-0 right-0 z-40 min-[730px]:hidden",
            "bg-black backdrop-blur-md",
            "flex flex-col px-6 pt-20 pb-8",
            "transition-all duration-300 ease-out",
            mobileOpen
              ? "visible pointer-events-auto opacity-100"
              : "invisible pointer-events-none opacity-0",
          )}
          aria-hidden={!mobileOpen}
        >
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10 hover:text-escobets-yellow"
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
                prefetch={false}
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-xl px-5 py-4 transition-colors hover:bg-white/10 hover:text-escobets-yellow active:text-escobets-yellow",
                  isActive(href) ? "text-escobets-yellow" : "text-white",
                )}
                style={navLinkStyle(isActive(href))}
              >
                {label}
              </Link>
            ))}
            <div className="mt-4 border-t border-white/10 pt-4">
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  disabled={isSigningOut}
                  className={cn(authPillBaseClass, "box-border w-full")}
                  style={authPillTextStyle}
                >
                  {isSigningOut ? "Wait…" : "Log Out"}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  asChild
                  disabled={isAuthLoading}
                  className="w-full p-0"
                >
                  <Link
                    prefetch={false}
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      authPillBaseClass,
                      "w-full text-white hover:text-escobets-yellow",
                    )}
                    style={authPillTextStyle}
                  >
                    Log In
                  </Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
