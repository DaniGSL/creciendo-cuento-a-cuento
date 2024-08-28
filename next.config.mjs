// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    serverRuntimeConfig: {
      // Aumenta el límite de tiempo a 60 segundos (o más si es necesario)
      apiTimeout: 60000,
    },
    // Añade esta configuración para manejar tiempos de espera más largos en Vercel
    experimental: {
      serverComponentsExternalPackages: ['openai'],
    },
  }
  
  export default nextConfig;