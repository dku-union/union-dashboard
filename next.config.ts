import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/docs/development-guide",
        destination: "/docs/quick-start",
        permanent: false,
      },
      {
        source: "/docs/design-guidelines",
        destination: "/docs/design",
        permanent: false,
      },
      {
        source: "/docs/bridge-api",
        destination: "/docs/development/bridge-api",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
