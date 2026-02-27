"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const socialIcons: Array<{
  label: string;
  char: string;
  href: string;
  icon?: boolean;
}> = [
  { label: "Google", char: "G", href: "#" },
  { label: "Facebook", char: "f", href: "#" },
  { label: "Instagram", char: "", href: "#", icon: true },
];

export function LoginForm({ className }: { className?: string }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = React.useState(false);

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[26rem] rounded-[1.25rem] border border-white/10 bg-black/40 p-8 shadow-xl backdrop-blur-md",
        className
      )}
    >
      <h1 className="font-gotham text-2xl font-bold text-white">Login</h1>
      <p className="mt-1 font-gotham text-sm text-white/90">
        Glad you&apos;re back
      </p>

      <form className="mt-6 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <Input
          type="text"
          placeholder="Username"
          autoComplete="username"
          aria-label="Username"
        />
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            aria-label="Password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-escobets-yellow hover:opacity-80"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <label className="flex cursor-pointer items-center gap-2 font-gotham text-sm text-white">
          <Checkbox
            checked={remember}
            onCheckedChange={setRemember}
            aria-label="Remember me"
          />
          Remember me
        </label>

        <Button type="submit" className="w-full rounded-[0.83331rem]">
          Login
        </Button>
      </form>

      <p className="mt-4 text-center">
        <Link
          href="/forgot-password"
          className="font-gotham text-sm text-white hover:text-escobets-yellow"
        >
          Forgot password ?
        </Link>
      </p>

      <div className="relative my-6 flex items-center">
        <div className="flex-grow border-t border-white/30" />
        <span className="px-3 font-gotham text-sm text-white">Or</span>
        <div className="flex-grow border-t border-white/30" />
      </div>

      <div className="flex justify-center gap-4">
        {socialIcons.map(({ label, char: c, href, icon }) => (
          <a
            key={label}
            href={href}
            aria-label={`Login with ${label}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black border border-white/20 text-white hover:border-escobets-yellow hover:text-escobets-yellow"
          >
            {icon ? (
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            ) : (
              <span className="font-gotham text-sm font-medium">{c}</span>
            )}
          </a>
        ))}
      </div>

      <p className="mt-6 text-center font-gotham text-sm text-white">
        Don&apos;t have an account ?{" "}
        <Link
          href="/signup"
          className="text-escobets-yellow hover:underline"
        >
          Signup
        </Link>
      </p>
    </div>
  );
}
