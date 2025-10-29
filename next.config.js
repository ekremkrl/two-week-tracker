/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    appDir: true,
    typedRoutes: true,
    turbo: {},
  },
};

module.exports = nextConfig;
