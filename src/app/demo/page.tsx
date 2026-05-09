import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { isDemoMode } from "@/lib/demo-mode";

/**
 * Static demo landing — no Supabase. Used when the project runs in demo mode
 * (`ESCOBETS_DEMO_BUILD` in `src/lib/demo-mode.ts` or env overrides).
 */
export default function DemoPage() {
  const demo = isDemoMode();

  return (
    <>
      <div className="relative z-10 min-h-screen bg-black text-white">
        <Header />
        <main className="mx-auto flex max-w-lg flex-col gap-6 px-6 py-16">
          <p className="text-xs font-medium uppercase tracking-wider text-escobets-yellow">
            EscoBets · demo
          </p>
          <h1 className="text-3xl font-normal leading-tight md:text-4xl">
            Static demo (Supabase paused)
          </h1>
          <p className="text-base leading-relaxed text-white/75">
            Auth and database features are turned off so the site loads without your Supabase
            project. The marketing home page at{" "}
            <Link href="/" className="text-escobets-yellow underline-offset-4 hover:underline">
              /
            </Link>{" "}
            uses built‑in defaults only.
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm text-white/70">
            <li>
              Set <code className="rounded bg-white/10 px-1.5 py-0.5">ESCOBETS_DEMO_BUILD = false</code>{" "}
              in <code className="rounded bg-white/10 px-1.5 py-0.5">src/lib/demo-mode.ts</code> when
              the backend is live again.
            </li>
            <li>
              Or set{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5">NEXT_PUBLIC_DEMO_MODE=false</code> in
              Vercel (.env) to force production auth.
            </li>
          </ul>
          <p className="text-sm leading-relaxed text-white/65">
            Want to see the sign-in layout? Open{" "}
            <Link href="/login" className="text-escobets-yellow underline-offset-4 hover:underline">
              /login
            </Link>
            — the form is visible, but email and social sign-in stay off in demo.
          </p>
          <p className="text-sm text-white/50">
            Demo mode active (server check):{" "}
            <span className="text-escobets-yellow">{demo ? "yes" : "no"}</span>
          </p>
          <Link
            href="/"
            className="inline-flex w-fit items-center justify-center rounded-xl border border-escobets-yellow px-5 py-2.5 text-sm text-escobets-yellow transition-colors hover:bg-escobets-yellow/10"
          >
            View marketing home
          </Link>
        </main>
        <Footer />
      </div>
    </>
  );
}
