/**
 * Next.js Configuration
 * Enables static export for deployment to GitHub Pages
 */

const isProd = process.env.NODE_ENV === 'production';
const { ProvidePlugin } = require('webpack');

module.exports = {
  output: 'export',
  basePath: isProd ? '/hajila-bau-website' : '',
  assetPrefix: isProd ? '/hajila-bau-website/' : '',
  trailingSlash: true,
  experimental: { externalDir: true },
  webpack(config) {
    config.cache = { type: 'filesystem' };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer')
    };
    config.plugins.push(
      new ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );
    return config;
  },
};
