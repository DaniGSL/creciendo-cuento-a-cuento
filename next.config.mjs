// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      serverComponentsExternalPackages: ['openai'],
    },
    // Si necesitas configurar límites de API, hazlo aquí
    api: {
      responseLimit: false,
      bodyParser: {
        sizeLimit: '1mb',
      },
    },
  }
  
  export default nextConfig;