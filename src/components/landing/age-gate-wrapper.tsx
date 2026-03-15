"use client";

import { useState, useEffect } from "react";
import { AgeGate, getAgeVerified } from "./age-gate";

interface AgeGateWrapperProps {
  children: React.ReactNode;
}

/**
 * Wraps the app and shows age verification until user confirms 18+.
 * Verification is stored in localStorage (backend can override later).
 */
export function AgeGateWrapper({ children }: AgeGateWrapperProps) {
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    setVerified(getAgeVerified());
  }, []);

  // During SSR and initial mount, show age gate to avoid flash of restricted content
  if (verified === null || !verified) {
    return <AgeGate onVerified={() => setVerified(true)} />;
  }

  return <>{children}</>;
}
