import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ForgotPasswordForm } from "@/components/landing/forgot-password-form";
import { VideoBackground } from "@/components/landing/video-background";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const sp = await searchParams;
  const fromAccount = sp.from === "account";

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />

      {/* Mobile: form on top, video section below so ball is visible */}
      <div className="relative flex flex-1 flex-col md:hidden">
        <main className="relative flex flex-col items-center px-4 pt-6 pb-4 shrink-0">
          <ForgotPasswordForm fromAccount={fromAccount} className="relative z-10" />
        </main>
        {/* Video section - ball visible under the form */}
        <div className="relative min-h-[20vh] flex-1 flex flex-col">
          <div className="absolute inset-0">
            <VideoBackground
              src="/videos/golden-ball.mp4"
              className="object-[center_bottom]"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"
            aria-hidden
          />
        </div>
      </div>

      {/* Desktop: form overlays video */}
      <div className="relative min-h-[75vh] flex-1 flex-col hidden md:flex">
        <div className="absolute inset-0 top-[50px]">
          <VideoBackground src="/videos/golden-ball.mp4" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20"
          aria-hidden
        />
        <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-12">
          <ForgotPasswordForm fromAccount={fromAccount} className="relative z-10" />
        </main>
      </div>

      <div className="relative z-10 shrink-0">
        <Footer />
      </div>
    </div>
  );
}
