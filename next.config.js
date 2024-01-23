/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["source.unsplash.com"]
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"]
    }
  }
};

module.exports = nextConfig;
