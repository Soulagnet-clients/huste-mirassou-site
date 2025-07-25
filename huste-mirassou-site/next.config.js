/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour l'export statique sur Netlify
  output: 'export',
  trailingSlash: true,

  // Configuration des images
  images: {
    domains: ['localhost'],
    unoptimized: true, // Nécessaire pour l'export statique
  },

  // Désactiver les fonctionnalités serveur pour l'export statique
  experimental: {
    esmExternals: false,
  },

  // Rewrites désactivés pour l'export statique
  // async rewrites() {
  //   return [
  //     {
  //       source: '/admin',
  //       destination: '/admin/index.html',
  //     },
  //   ];
  // },

  // Configuration du base path si nécessaire
  // basePath: '',

  // Configuration des assets
  assetPrefix: '',
};

module.exports = nextConfig;
