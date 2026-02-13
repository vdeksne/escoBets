import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-black px-4 py-24 md:py-32">
      {/* Subtle star-like speckles */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(223, 255, 0, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(223, 255, 0, 0.08) 0%, transparent 40%)`,
        }}
      />
      <div className="container relative mx-auto max-w-4xl text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <span className="text-3xl font-bold tracking-tight md:text-4xl">
            <span className="text-white">ESCO</span>
            <span className="text-escobets-yellow">BETS</span>
          </span>
        </div>
        <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
          Elite Telegram Betting Insights
        </h1>
        <p className="mb-6 text-xl text-white/90 md:text-2xl">
          High-Confidence Picks. Proven Data. Real Results.
        </p>
        <Button variant="outline" size="lg" className="mb-6" asChild>
          <Link href="/subscribe">Join Now</Link>
        </Button>
        <p className="text-sm text-white/70">
          Exclusive picks, detailed analysis, and transparent profit/loss
          tracking
        </p>
      </div>
    </section>
  );
}
