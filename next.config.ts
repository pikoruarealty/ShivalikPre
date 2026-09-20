import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/shivalik-presente", destination: "/", permanent: true },
      { source: "/shivalik-presente-4-bhk", destination: "/4-bhk-apartments-gift-city", permanent: true },
      { source: "/shivalik-presente-penthouse", destination: "/6-bhk-penthouse-gift-city", permanent: true },
      { source: "/luxury-penthouses-gift-city", destination: "/6-bhk-penthouse-gift-city", permanent: true },
      { source: "/ultra-luxury-apartments-gift-city", destination: "/luxury-apartments-gift-city", permanent: true },
      { source: "/luxury-homes-gift-city", destination: "/luxury-apartments-gift-city", permanent: true },
      { source: "/luxury-apartments-for-sale-gift-city", destination: "/luxury-apartments-gift-city", permanent: true },
    ];
  },
  async headers() { return [{ source: "/(.*)", headers: [{ key: "X-Content-Type-Options", value: "nosniff" }, { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }, { key: "X-Frame-Options", value: "SAMEORIGIN" }, { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }] }]; },
};

export default nextConfig;
