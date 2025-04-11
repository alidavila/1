/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    optimizeCss: true,
    turbo: {
      rules: {
        '*.js': [
          {
            loader: 'babel-loader',
          },
        ],
      },
    },
  },
  // Configuración para evitar problemas con webpack
  webpack: (config, { isServer }) => {
    // Optimizaciones para desarrollo
    if (process.env.NODE_ENV === 'development') {
      config.optimization.moduleIds = 'named';
      config.optimization.minimize = false;
    }
    
    // Resolución de problemas con módulos de Node.js en cliente
    if (!isServer) {
      // Evita la carga de módulos de Node.js en el navegador
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      };
    }
    
    // Evitar errores de acceso a archivos
    config.watchOptions = {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: ['**/node_modules', '**/.git'],
    };
    
    return config;
  },
  // Usar publicPath para evitar problemas de carga de recursos
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  // Evitar errores de CORS en desarrollo
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 