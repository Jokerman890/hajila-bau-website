import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'
const isGitHubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true'

const nextConfig: NextConfig = {
  // Nur für GitHub Pages statischen Export verwenden
  ...(isGitHubPages && { output: 'export' }),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hajila-bau.de',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.github.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  basePath: isProd ? '/hajila-bau-website' : '',
  assetPrefix: isProd ? '/hajila-bau-website/' : '',
  trailingSlash: true,
  experimental: { externalDir: true },
  // Cross-Origin-Requests im Dev-Modus explizit erlauben (Next.js 14+)
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost',
    'http://127.0.0.1',
  ],
  webpack(config, { webpack }) {
    config.cache = { type: 'filesystem' }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer'),
    }
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    )
    return config
  },
}

export default nextConfig
