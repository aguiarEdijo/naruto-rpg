import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ⚠️ Ignora erros de tipo durante o build
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Ignora erros de ESLint durante o build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
