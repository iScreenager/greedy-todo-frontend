declare module "next-pwa" {
  import { NextConfig } from "next";

  type NextPWAConfig = {
    dest: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    buildExcludes?: string[];
    [key: string]: unknown;
  };

  export default function withPWA(
    config?: NextPWAConfig
  ): (nextConfig: NextConfig) => NextConfig;
}
