import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@speak-coach/shared"],
  outputFileTracingRoot: path.join(__dirname, "../.."),
  output: "export",
  images: { unoptimized: true },
  devIndicators: false,
};

export default nextConfig;
