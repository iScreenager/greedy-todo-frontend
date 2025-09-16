import type { NextConfig } from "next";
import withPWA from "next-pwa";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default withPWA({
  dest: "public",
  disable: isProd ? false : true,
  register: true,
  skipWaiting: true,
})(nextConfig);
