import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Ensure correct workspace root when multiple lockfiles exist
  outputFileTracingRoot: path.join(__dirname, "."),
  // Reduce dev-only overlay activity that can trigger RSC manifest bugs (segment-explorer)
  devIndicators: false,
};

export default nextConfig;
