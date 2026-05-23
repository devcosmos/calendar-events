import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./app/src/core/i18n/i18n.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  basePath: '/schedule',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'test.ru',
      },
    ],
  },
  trailingSlash: true,
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'X-Accel-Buffering',
            value: 'no',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
