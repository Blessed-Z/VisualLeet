import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // 确保在 Docker 环境下能正常工作
  experimental: {
    // 可以在这里加一些特定的配置
  },
};

export default nextConfig;
