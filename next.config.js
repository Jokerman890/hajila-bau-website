/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['hajila-bau.de', 'readdy.ai'],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/hajila-bau-website' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/hajila-bau-website/' : '',
}

module.exports = nextConfig
