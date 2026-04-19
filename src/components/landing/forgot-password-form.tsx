"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm({
  className,
  fromAccount = false,
}: {
  className?: string;
  /** When opened from the account “change password” flow, show a return link to `/account`. */
  fromAccount?: boolean;
}) {
  const supabase = React.useMemo(() => createClient(), []);
  const [email, setEmail] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage("Reset link sent. Check your inbox.");
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
      <h1 className="font-gotham text-xl sm:text-2xl font-bold text-white text-center">
        Forgot Password ?
      </h1>
      <p className="mt-1 font-gotham text-sm text-white/90 text-center">
        Enter your email to receive a reset link
      </p>

      <form className="mt-5 sm:mt-6 flex flex-col gap-3 sm:gap-4" onSubmit={handleSubmit}>
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="example@mail.com"
          autoComplete="email"
          aria-label="Email"
          required
          className="rounded-[0.99975rem] border-[1.333px] border-[#FFF] bg-transparent placeholder:text-white/70 focus:border-[#FFF] focus:ring-0"
        />

        <Button type="submit" className="w-full rounded-[0.83331rem]" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Reset Password"}
        </Button>
        {errorMessage ? (
          <p className="text-sm text-red-300" role="alert">
            {errorMessage}
          </p>
        ) : null}
        {successMessage ? (
          <p className="text-sm text-green-300" role="status">
            {successMessage}
          </p>
        ) : null}
      </form>

      <p className="mt-4 text-center font-gotham text-sm text-white/80">
        <Link
          href={fromAccount ? "/account" : "/login"}
          className="text-escobets-yellow hover:underline"
        >
          {fromAccount ? "Back to account" : "Back to login"}
        </Link>
      </p>

      <p className="mt-4 text-center font-gotham text-sm text-white">
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
