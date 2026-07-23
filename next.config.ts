import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ESLint is run separately; skip during `next build` to avoid
    // eslint-config-next v15 + ESLint v9 flat config incompatibility on Vercel.
    ignoreDuringBuilds: true,
  },

  images: {
    // unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'abc.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'darkred-wolverine-470808.hostingersite.com',
      },
      {
        protocol: 'https',
        hostname: 'mediumpurple-mouse-468509.hostingersite.com',
      }
    ],
  },
};

export default nextConfig;
