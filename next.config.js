/**
 * Next.js Configuration
 * Enables static export for deployment to GitHub Pages
 */

module.exports = {
  output: 'export',
  alias: {
    '/public/': '/_next/static/',
    '/images/': '/_next/static/media/'
  }
};
