/**
 * Next.js Configuration
 * Enables static export for deployment to GitHub Pages
 */

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  output: 'export',
  basePath: isProd ? '/hajila-bau-website' : '',
  assetPrefix: isProd ? '/hajila-bau-website/' : '',
  images: {
    unoptimized: true
  }
};
