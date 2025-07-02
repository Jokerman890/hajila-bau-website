import type { NextConfig } from "next";

const isExport = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  output: 'export',
  ...(isExport && {
    basePath: '/hajila-bau-website',
    assetPrefix: '/hajila-bau-website/',
  }),
  // Cross-Origin-Requests im Dev-Modus explizit erlauben (Next.js 14+)
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost',
    'http://127.0.0.1',
  ],
};

export default nextConfig;
