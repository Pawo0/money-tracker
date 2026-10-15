import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow an isolated preview cache alongside an existing development server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
