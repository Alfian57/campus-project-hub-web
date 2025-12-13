import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Allow localhost images in production mode
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/**",
      },
    ],
    // Use unoptimized for development with localhost
    unoptimized: process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_UNOPTIMIZED_IMAGES === "true",
  },
};

export default nextConfig;
