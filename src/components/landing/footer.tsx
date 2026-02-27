import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-black px-4 py-12">
      <div className="container mx-auto flex flex-col items-center gap-8 text-center">
        <Image
          src="/images/EscoBets_Logo.svg"
          alt="EscoBets"
          width={64}
          height={66}
          className="h-auto w-16"
        />
        <div className="w-full max-w-md border-t border-white/20" />
        <p className="text-sm text-escobets-yellow/80">
          © 2026 Escobets. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
