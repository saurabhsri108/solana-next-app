/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'lh3.googleusercontent.com',
      's.gravatar.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
