export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-12">
      <div className="container mx-auto flex flex-col items-center gap-4 text-center">
        <span className="text-xl font-bold tracking-tight">
          <span className="text-white">ESCO</span>
          <span className="text-escobets-yellow">BETS</span>
        </span>
        <p className="text-sm text-white/60">
          © 2026 ESCOBETS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
