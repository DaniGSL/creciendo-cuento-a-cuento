/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['openai'],
  },
  serverRuntimeConfig: {
    functions: {
      maxDuration: 60,
    },
  },
  env: {
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[name][ext]',
      },
    });
    return config;
  },
  i18n: {
    locales: ['es', 'ca', 'gl', 'en', 'fr', 'de', 'ur', 'ar'],
    defaultLocale: 'es',
    localeDetection: false,
  },
}

export default nextConfig;