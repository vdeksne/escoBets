import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EscoBets – Elite Telegram Betting Insights",
  description:
    "High-Confidence Picks. Proven Data. Real Results. Exclusive picks, detailed analysis, and transparent profit/loss tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
