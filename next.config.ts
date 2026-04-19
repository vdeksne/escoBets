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

const nextConfig: NextConfig = {
  // Ensure correct workspace root when multiple lockfiles exist
  outputFileTracingRoot: path.join(__dirname, "."),
  // Reduce dev-only overlay activity that can trigger RSC manifest bugs (segment-explorer)
  devIndicators: false,
  // Browsers request /favicon.ico by default; we only ship SVG under public/images
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/images/EscoBets_Logo.svg" }];
  },
  ...(supabaseImageRemote ? { images: supabaseImageRemote } : {}),
};

export default nextConfig;
