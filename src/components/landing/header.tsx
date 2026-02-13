"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/news", label: "News" },
  { href: "/profit-tracker", label: "Profit Tracker" },
  { href: "/subscription", label: "Subscription" },
  { href: "/account", label: "Account" },
  { href: "/users", label: "Users" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <nav className="flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-white transition-colors hover:text-escobets-yellow"
            >
              {label}
            </Link>
          ))}
        </nav>
        <Button variant="outline" size="default" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </header>
  );
}
