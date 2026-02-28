"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Full-screen video background with gradient fallback when video fails to load (e.g. 404). */
export function VideoBackground({
  src = "/videos/golden-ball.mp4",
  className,
}: {
  src?: string;
  className?: string;
}) {
  const [hasError, setHasError] = React.useState(false);

  if (hasError) {
    return (
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute bottom-0 left-1/2 h-[60vh] w-[80vw] max-w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-t from-escobets-yellow/20 via-escobets-yellow/5 to-transparent blur-3xl" />
      </div>
    );
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full object-contain opacity-80",
        "object-[center_95%] md:object-[center_bottom]",
        className
      )}
      aria-hidden
      onError={() => setHasError(true)}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
