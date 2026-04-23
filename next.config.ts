import type { NextConfig } from "next";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseImageRemote: NextConfig["images"] | undefined;
try {
  if (supabaseUrl) {
    const u = new URL(supabaseUrl);
    supabaseImageRemote = {
      remotePatterns: [
        {
          protocol: u.protocol === "https:" ? "https" : "http",
          hostname: u.hostname,
          ...(u.port ? { port: u.port } : {}),
          pathname: "/storage/v1/object/public/**",
        },
      ],
    };
  }
} catch {
  supabaseImageRemote = undefined;
}

/** Telegram Login `photo_url` is served from Telegram CDNs (not Supabase Storage). */
const telegramAvatarRemotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  "cdn.telegram-cdn.org",
  "cdn1.telegram-cdn.org",
  "cdn2.telegram-cdn.org",
  "cdn3.telegram-cdn.org",
  "cdn4.telegram-cdn.org",
  "cdn5.telegram-cdn.org",
].map((hostname) => ({
  protocol: "https" as const,
  hostname,
  pathname: "/**" as const,
}));
telegramAvatarRemotePatterns.push({
  protocol: "https",
  hostname: "t.me",
  pathname: "/**",
});

/** X/Twitter CDN (profile + media from API v2). */
const xImagePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  { protocol: "https", hostname: "pbs.twimg.com", pathname: "/**" },
  { protocol: "https", hostname: "video.twimg.com", pathname: "/**" },
];

/** Google OAuth / Sign-in with Google – profile photos (e.g. lh3.googleusercontent.com). */
const googleUserContentPatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
  { protocol: "https", hostname: "lh4.googleusercontent.com", pathname: "/**" },
  { protocol: "https", hostname: "lh5.googleusercontent.com", pathname: "/**" },
  { protocol: "https", hostname: "lh6.googleusercontent.com", pathname: "/**" },
];

const mergedImages: NextConfig["images"] = {
  remotePatterns: [
    ...(supabaseImageRemote?.remotePatterns ?? []),
    ...telegramAvatarRemotePatterns,
    ...xImagePatterns,
    ...googleUserContentPatterns,
  ],
};

const nextConfig: NextConfig = {
  // Ensure correct workspace root when multiple lockfiles exist
  outputFileTracingRoot: path.join(__dirname, "."),
  // Reduce dev-only overlay activity that can trigger RSC manifest bugs (segment-explorer)
  devIndicators: false,
  // Browsers request /favicon.ico by default; we only ship SVG under public/images
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/images/EscoBets_Logo.svg" }];
  },
  async redirects() {
    return [{ source: "/subscribe", destination: "/subscription", permanent: true }];
  },
  images: mergedImages,
};

export default nextConfig;
