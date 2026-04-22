"use client";

import Image from "next/image";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "escobets-age-verified";

export function getAgeVerified(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function setAgeVerified(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, "true");
}

interface AgeGateProps {
  onVerified?: () => void;
}

export function AgeGate({ onVerified }: AgeGateProps) {
  const handleYes = () => {
    setAgeVerified();
    onVerified?.();
  };

  const handleNo = () => {
    // User is not 18 - could show message, redirect, or do nothing
    // Backend can handle this later
  };

  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen flex-col bg-black">
      {/* Background - soccer ball positioned right, visible texture */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <Image
          src="/images/soccerball.jpg"
          alt=""
          fill
          className="object-cover object-right-bottom opacity-60"
          style={{ objectPosition: "70% 60%" }}
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/50"
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header showDesktopBrand={false} />

        {/* Main content - centered, ball visible on right */}
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
          <div className="flex max-w-md flex-col items-center text-center">
            {/* Logo - EscoBets branding (SVG has yellow + white) */}
            <div className="mb-10">
              <Image
                src="/images/EscoBets_Logo.svg"
                alt="EscoBets"
                width={180}
                height={48}
                className="h-14 w-auto md:h-16"
              />
            </div>

            <h1 className="font-gotham text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Are you 18 or older?
            </h1>
            <p className="mt-4 font-gotham text-base text-white/80 md:text-lg">
              You must be 18 years or older to access this website.
            </p>

            {/* Action buttons */}
            <div className="mt-12 flex w-full max-w-sm flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                onClick={handleYes}
                className="rounded-lg bg-escobets-yellow px-8 py-3 font-gotham font-medium text-black hover:bg-escobets-yellow/90"
              >
                Yes
              </Button>
              <Button
                variant="outline"
                onClick={handleNo}
                className="rounded-lg border-2 border-white/30 bg-transparent px-8 py-3 font-gotham font-medium text-white hover:bg-white/10"
              >
                No
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
