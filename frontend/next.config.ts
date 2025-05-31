import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    WATCHPACK_POLLING: process.env.WATCHPACK_POLLING || "true",
  },
};

export default nextConfig;
