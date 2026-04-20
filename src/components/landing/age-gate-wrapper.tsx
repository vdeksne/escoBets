"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { AgeGate, getAgeVerified } from "./age-gate";

interface AgeGateWrapperProps {
  children: React.ReactNode;
}

/**
 * Wraps the app and shows age verification until user confirms 18+.
 * Verification is stored in localStorage (backend can override later).
 */
const AUTH_RELATED_PATHS = new Set([
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/terms",
]);

function skipAgeGateForPath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (AUTH_RELATED_PATHS.has(pathname)) return true;
  return pathname.startsWith("/reset-password/");
}

/** Hash/query only — Supabase recovery often lands on Site URL (/) first. */
function isSupabaseAuthCallback(search: string, hash: string): boolean {
  const q = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const h = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
  return (
    q.has("code") ||
    h.has("access_token") ||
    h.get("type") === "recovery" ||
    h.has("error") ||
    h.has("error_code")
  );
}

export function AgeGateWrapper({ children }: AgeGateWrapperProps) {
  const pathname = usePathname();
  const [verified, setVerified] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    if (pathname !== "/") return;
    const { search, hash } = window.location;
    if (!search && !hash) return;
    if (!isSupabaseAuthCallback(search, hash)) return;
    window.location.replace(`/reset-password${search}${hash}`);
  }, [pathname]);

  useEffect(() => {
    setVerified(getAgeVerified());
  }, []);

  if (skipAgeGateForPath(pathname)) {
    return <>{children}</>;
  }

  // During SSR and initial mount, show age gate to avoid flash of restricted content
  if (verified === null || !verified) {
    return <AgeGate onVerified={() => setVerified(true)} />;
  }

  return <>{children}</>;
}
