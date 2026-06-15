import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "*": [
      "./public/assets/CAT - 2026/**",
    ],
  },
};

export default nextConfig;
