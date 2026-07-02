import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOTE: Do NOT set output: "standalone" here.
  // Vercel uses the default output (serverless functions).
  // standalone is only for Docker / self-hosted deployments.
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
