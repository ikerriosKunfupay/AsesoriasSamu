import type { NextConfig } from "next";

const vercelDeploymentId = process.env.VERCEL_DEPLOYMENT_ID
  ?.replace(/^dpl_/, "")
  .replace(/[^a-zA-Z0-9_-]/g, "")
  .slice(0, 32);

const nextConfig: NextConfig = {
  ...(vercelDeploymentId ? { deploymentId: vercelDeploymentId } : {}),
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    taint: true,
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
