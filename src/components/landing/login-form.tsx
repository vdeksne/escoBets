"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supabase/client";
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
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);
  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/account");
    router.refresh();
  };

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[26rem] p-6 sm:p-7 md:p-8",
        "rounded-[1.25rem] sm:rounded-[1.5rem] md:rounded-[1.66625rem]",
        "border-[1.333px] border-[#AFAFAF]",
        "backdrop-blur-[35.32px]",
        "shadow-lg",
        className
      )}
      style={{
        background:
          "linear-gradient(321deg, rgba(191, 191, 191, 0.06) 5.98%, rgba(0, 0, 0, 0.00) 66.28%), rgba(0, 0, 0, 0.14)",
        boxShadow: "-10.664px 5.332px 6.665px 0 rgba(0, 0, 0, 0.24)",
      }}
    >
      <h1 className="font-gotham text-xl sm:text-2xl font-bold text-white">Login</h1>
      <p className="mt-1 font-gotham text-sm text-white/90">
        Glad you&apos;re back
      </p>

      <form className="mt-5 sm:mt-6 flex flex-col gap-3 sm:gap-4" onSubmit={handleSubmit}>
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          autoComplete="email"
          aria-label="Email"
          required
          className="rounded-[0.99975rem] border-[1.333px] border-[#FFF] bg-transparent placeholder:text-white/70 focus:border-[#FFF] focus:ring-0"
        />
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            aria-label="Password"
            required
            className="pr-10 rounded-[0.99975rem] border-[1.333px] border-[#FFF] bg-transparent placeholder:text-white/70 focus:border-[#FFF] focus:ring-0"
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

        <Button type="submit" className="w-full rounded-[0.83331rem]" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
        {errorMessage ? (
          <p className="text-sm text-red-300" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </form>

      <p className="mt-3 sm:mt-4 text-center">
        <Link
          href="/forgot-password"
          className="font-gotham text-sm text-white hover:text-escobets-yellow"
        >
          Forgot password ?
        </Link>
      </p>

      <div className="relative my-4 sm:my-6 flex items-center">
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

      <p className="mt-5 sm:mt-6 text-center font-gotham text-sm text-white">
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
