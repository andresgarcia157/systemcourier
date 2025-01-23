/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["localhost", "your-production-domain.com"],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig

