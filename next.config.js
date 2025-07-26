/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export statique pour Netlify
  output: 'export',
  trailingSlash: true,

  // Configuration des images pour export statique
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },

  // Rewrites pour TinaCMS
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html',
      },
    ];
  },
};

module.exports = nextConfig;
