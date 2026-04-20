import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_TELEGRAM_INVITE_URL } from "@/lib/subscription/telegram-invite";

export default function SubscriptionConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header variant="withLogo" />

      {/* Background: subtle soccer ball image */}
      <div className="relative flex min-h-[60vh] flex-1 flex-col md:min-h-[75vh]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/soccerball.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-45"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-black/80"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent"
            aria-hidden
          />
        </div>

        <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center sm:gap-8">
            <Link
              prefetch={false}
              href="/"
              aria-label="EscoBets home"
              className="shrink-0"
            >
              <Image
                src="/images/EscoBets_Logo.svg"
                alt="EscoBets"
                width={180}
                height={48}
                className="h-12 w-auto"
                style={{ width: "auto", height: "auto" }}
              />
            </Link>

            <h1 className="font-gotham text-2xl font-bold text-white md:text-3xl">
              You&apos;re in - thank you
            </h1>

            <p className="max-w-lg font-gotham text-sm leading-relaxed text-white/82 md:text-base">
              Your membership is active. Tap below to join the private{" "}
              <span className="text-escobets-yellow">EscoBets</span> Telegram
              channel for picks and alerts.
            </p>

            <Button
              variant="outline"
              asChild
              className="w-full max-w-sm rounded-lg border-2 border-escobets-yellow bg-transparent px-8 py-6 font-gotham text-lg font-medium text-white hover:border-escobets-yellow hover:bg-escobets-yellow/10 sm:w-auto"
            >
              <Link
                href={SUBSCRIPTION_TELEGRAM_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join EscoBets on Telegram
              </Link>
            </Button>

            <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                asChild
                className="w-full rounded-lg bg-escobets-yellow font-gotham font-medium text-black hover:bg-escobets-yellow/90 sm:w-auto sm:min-w-[11rem]"
              >
                <Link prefetch={false} href="/account">
                  Back to site
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full rounded-lg border-white/20 bg-black/30 font-gotham font-medium text-white hover:bg-white/10 sm:w-auto sm:min-w-[11rem]"
              >
                <Link prefetch={false} href="/subscription">
                  Back to pricing
                </Link>
              </Button>
            </div>

            <p className="max-w-md font-gotham text-xs leading-relaxed text-white/55">
              If the app asks for confirmation, approve the invite. Keep this
              link private - it&apos;s tied to member access. Need help? Use{" "}
              <Link
                prefetch={false}
                href="/account/subscription"
                className="text-escobets-yellow hover:underline"
              >
                Manage subscription
              </Link>{" "}
              from your account.
            </p>
          </div>
        </main>
      </div>

      <div className="relative z-10 shrink-0">
        <Footer />
      </div>
    </div>
  );
}
