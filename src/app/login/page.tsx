import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { LoginForm } from "@/components/landing/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-12">
        {/* Decorative golden sphere area - optional background accent */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="absolute bottom-0 left-1/2 h-[60vh] w-[80vw] max-w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-t from-escobets-yellow/20 via-escobets-yellow/5 to-transparent blur-3xl" />
        </div>
        <LoginForm className="relative z-10" />
      </main>
      <Footer />
    </div>
  );
}
