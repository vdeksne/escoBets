import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black px-4 py-12">
      <div className="container mx-auto flex flex-col items-center gap-10 text-center">
        {/* Separator line first */}
        <div className="w-full max-w-2xl border-t border-white/20" />
        <Link prefetch={false} href="/" aria-label="EscoBets home">
          <Image
            src="/images/EscoBets_Logo.svg"
            alt="EscoBets"
            width={64}
            height={66}
            className="h-auto w-16"
            style={{ width: "auto", height: "auto" }}
          />
        </Link>
        <p className="text-sm text-white">
          © <span className="text-escobets-yellow">2026</span> Escobets. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
