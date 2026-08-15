/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/poems/lllll',
        destination: '/poems/ek-tarfa-mohabbat',
        permanent: true,
      },
      {
        source: '/poems/poem',
        destination: '/poems/kirdar-badal-ke',
        permanent: true,
      },
      {
        source: '/poems/log-U8W3U',
        destination: '/poems/log',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
