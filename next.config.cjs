/**
 * Next.js Configuration (CommonJS fallback)
 * This file mirrors next.config.js but uses CommonJS to avoid ESM runtime errors
 * when tools expect CommonJS (linters or older Next.js helpers).
 */

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  output: 'export',
  basePath: isProd ? '/hajila-bau-website' : '',
  assetPrefix: isProd ? '/hajila-bau-website/' : '',
  trailingSlash: true,
};
