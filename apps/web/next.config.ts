import type { NextConfig } from "next";
import path from "path";

const API_ORIGIN = process.env.API_ORIGIN ?? "http://127.0.0.1:8787";

const nextConfig: NextConfig = {
  transpilePackages: ["@speak-coach/shared"],
  outputFileTracingRoot: path.join(__dirname, "../.."),
  output: "export",
  images: { unoptimized: true },
  devIndicators: false,
  // Local same-origin /api proxy (mirrors Pages Functions) so auth cookies work in next dev.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_ORIGIN}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
