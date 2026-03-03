import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";

const TELEGRAM_TIPSTER_URL = "https://t.me/escobets"; // Update with actual Telegram channel

export default function SubscriptionConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header variant="withLogo" />

      {/* Background: subtle soccer ball image */}
      <div className="relative flex flex-1 flex-col min-h-[60vh] md:min-h-[75vh]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="flex h-full w-full items-center justify-center">
            <div className="relative h-[55%] w-[65%] min-w-[320px] md:h-[60%] md:w-[60%]">
              <Image
                src="/images/soccerball.jpg"
                alt=""
                fill
                sizes="(min-width: 768px) 60vw, 65vw"
                className="object-contain object-center opacity-40 md:opacity-50"
                aria-hidden
              />
            </div>
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"
            aria-hidden
          />
        </div>

        <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-8 text-center">
            {/* Logo */}
            <Link href="/" aria-label="EscoBets home" className="shrink-0">
              <Image
                src="/images/EscoBets_Logo.svg"
                alt="EscoBets"
                width={180}
                height={48}
                className="h-12 w-auto"
                style={{ width: "auto", height: "auto" }}
              />
            </Link>

            {/* Heading */}
            <h1 className="font-gotham text-2xl font-bold text-white md:text-3xl">
              Thank you for subscribing
            </h1>

            {/* Instruction */}
            <p className="font-gotham text-lg text-white/90">Follow the link:</p>

            {/* Telegram Tipster button */}
            <Button
              variant="outline"
              asChild
              className="rounded-lg border-2 border-white bg-transparent px-8 py-6 font-gotham text-lg font-medium text-white hover:bg-white/10 hover:border-white"
            >
              <Link href={TELEGRAM_TIPSTER_URL} target="_blank" rel="noopener noreferrer">
                Telegram Tipster
              </Link>
            </Button>
            <Link
              href="/account/subscription"
              className="font-gotham text-sm text-white/70 hover:text-escobets-yellow hover:underline"
            >
              Manage subscription
            </Link>
          </div>
        </main>
      </div>

      <div className="relative z-10 shrink-0">
        <Footer />
      </div>
    </div>
  );
}
