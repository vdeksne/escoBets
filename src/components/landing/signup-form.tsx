"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validatePasswordStrength } from "@/lib/account/password-policy";
import { OAuthSocialButtons } from "@/components/landing/oauth-social-buttons";
import { TermsAcceptance } from "@/components/legal/terms-acceptance";
import { cn } from "@/lib/utils";
import type { ApiResponse } from "@/types/api";

export function SignupForm({ className }: { className?: string }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [termsAccepted, setTermsAccepted] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!termsAccepted) {
      setErrorMessage("Please read and accept the Terms and Conditions to create an account.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const strength = validatePasswordStrength(password.trim());
    if (!strength.ok) {
      setErrorMessage(strength.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: password.trim(),
          username,
        }),
      });

      const json = (await response.json()) as ApiResponse<{ message: string }>;

      if (!response.ok || !json || json.success === false) {
        setErrorMessage(
          json && json.success === false ? json.error.message : "Signup failed. Please try again."
        );
        return;
      }

      setSuccessMessage(json.data.message);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
      <h1 className="font-gotham text-xl sm:text-2xl font-bold text-white">Signup</h1>
      <p className="mt-1 font-gotham text-sm text-white/90">
        Create your account
      </p>

      <form className="mt-5 sm:mt-6 flex flex-col gap-3 sm:gap-4" onSubmit={handleSubmit}>
        <Input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
          autoComplete="username"
          aria-label="Username"
          required
          className="rounded-[0.99975rem] border-[1.333px] border-[#FFF] bg-transparent placeholder:text-white/70 focus:border-[#FFF] focus:ring-0"
        />
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
            autoComplete="new-password"
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
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm Password"
            autoComplete="new-password"
            aria-label="Confirm Password"
            required
            className="pr-10 rounded-[0.99975rem] border-[1.333px] border-[#FFF] bg-transparent placeholder:text-white/70 focus:border-[#FFF] focus:ring-0"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-escobets-yellow hover:opacity-80"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <TermsAcceptance
          idPrefix="signup"
          accepted={termsAccepted}
          onAcceptedChange={setTermsAccepted}
          context="signup"
          className="mt-1"
        />

        <Button
          type="submit"
          className="w-full rounded-[0.83331rem]"
          disabled={isSubmitting || !termsAccepted}
          title={!termsAccepted ? "Accept the Terms and Conditions to continue" : undefined}
        >
          {isSubmitting ? "Signing up..." : "Signup"}
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

      <div className="relative my-4 sm:my-6 flex items-center">
        <div className="flex-grow border-t border-white/30" />
        <span className="px-3 font-gotham text-sm text-white">Or</span>
        <div className="flex-grow border-t border-white/30" />
      </div>

      <OAuthSocialButtons nextPath="/account" />

      <p className="mt-5 sm:mt-6 text-center font-gotham text-sm text-white">
        Already Registered ?{" "}
        <Link
          href="/login"
          className="text-escobets-yellow hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
