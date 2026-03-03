import Image from "next/image";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { SubscriptionForm } from "@/components/landing/subscription-form";

export default function SubscriptionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header variant="withLogo" />

      {/* Mobile: image as background behind form */}
      <div className="relative flex flex-1 flex-col md:hidden min-h-[60vh]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/soccerball.jpg"
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 0px"
            className="object-cover object-[75%_75%] opacity-60"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"
            aria-hidden
          />
        </div>
        <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-6 pb-4">
          <SubscriptionForm />
        </main>
      </div>

      {/* Desktop: form overlays image */}
      <div className="relative min-h-[75vh] flex-1 flex-col hidden md:flex">
        <div className="absolute inset-0 top-[50px] h-full w-full overflow-hidden">
          <Image
            src="/images/soccerball.jpg"
            alt=""
            fill
            sizes="(min-width: 768px) 60vw, 0px"
            className="object-contain object-[75%_bottom] opacity-80"
            aria-hidden
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20"
          aria-hidden
        />
        <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-12">
          <SubscriptionForm className="relative z-10" />
        </main>
      </div>

      <div className="relative z-10 shrink-0">
        <Footer />
      </div>
    </div>
  );
}
