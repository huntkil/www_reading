/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MCP_SERVER_URL: process.env.MCP_SERVER_URL,
    MCP_API_KEY: process.env.MCP_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        ignored: /node_modules|\.git|\.next|dist|build|coverage|\.env|\.DS_Store|Thumbs\.db|\.vscode|\.idea|__tests__|__mocks__|\.test\.|\.spec\.|\.swp$|\.swo$|\.tmp$|\.log$/,
        poll: 1000, // Poll every 1 second instead of watching
        aggregateTimeout: 300, // Wait 300ms after changes before rebuilding
      };
    }
    return config;
  },
  // Remove deprecated experimental.appDir warning
  experimental: {
    // appDir: true, // This is now default in Next.js 13+
  },
};

module.exports = nextConfig; 