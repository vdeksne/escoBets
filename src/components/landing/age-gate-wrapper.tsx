"use client";

import { useState, useEffect } from "react";
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
]);

function skipAgeGateForPath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (AUTH_RELATED_PATHS.has(pathname)) return true;
  return pathname.startsWith("/reset-password/");
}

export function AgeGateWrapper({ children }: AgeGateWrapperProps) {
  const pathname = usePathname();
  const [verified, setVerified] = useState<boolean | null>(null);

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
