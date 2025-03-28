/** @type {import('next').NextConfig} */
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to load these server-only modules on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'serialport': false,
        'ws': false,
      }
    }
    return config
  },
  // Enable WebSocket in development
  webpack5: true,
  webSocketServer: {
    path: '/api/scale',
  }
}

module.exports = withMDX(nextConfig) 