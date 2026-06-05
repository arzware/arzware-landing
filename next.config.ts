import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  basePath:
    process.env.GITHUB_PAGES === "true" &&
    process.env.GITHUB_REPOSITORY &&
    !process.env.GITHUB_REPOSITORY.endsWith(".github.io")
      ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}`
      : "",
};

export default nextConfig;
