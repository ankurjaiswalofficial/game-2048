import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.STATIC_URL_PATH || "",
};

export default nextConfig;
