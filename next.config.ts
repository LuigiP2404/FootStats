import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Team and league logos served by API-Football.
    remotePatterns: [new URL("https://media.api-sports.io/football/**")],
  },
};

export default nextConfig;
