/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    serverRuntimeConfig: {
      // Aumenta el límite de tiempo a 60 segundos (o más si es necesario)
      apiTimeout: 60000,
    },
  }
  
  module.exports = nextConfig