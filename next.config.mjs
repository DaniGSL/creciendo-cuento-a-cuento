// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['openai'],
  },
  serverRuntimeConfig: {
    functions: {
      maxDuration: 60, // Aumenta el límite a 60 segundos
    },
  },
  env: {
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
  },
}

export default nextConfig;