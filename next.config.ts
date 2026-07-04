import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "*": [
      "./public/assets/CAT - 2026/**",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lkrorieuntbtfxfspogs.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
