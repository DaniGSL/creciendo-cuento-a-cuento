// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      serverComponentsExternalPackages: ['openai'],
    },
    // Configuración para aumentar el límite de tiempo de las funciones serverless
    serverRuntimeConfig: {
      functions: {
        maxDuration: 60, // Aumenta el límite a 60 segundos
      },
    },
  }
  
  export default nextConfig;