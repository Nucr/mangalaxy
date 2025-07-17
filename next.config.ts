import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mangalaxy-static.vercel.app",
      },
    ],
  },
};

export default nextConfig;
