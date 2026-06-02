/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-project.supabase.co'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(vert|frag)$/,
      use: 'raw-loader',
    });
    return config;
  },
};

export default nextConfig;
