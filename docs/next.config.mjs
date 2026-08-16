import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  outputFileTracingRoot: __dirname,
  async redirects() {
    return [
      {
        source: '/docs/installation',
        destination: '/docs',
        permanent: true,
      },
      {
        source: '/docs/components/form/button-action',
        destination: '/docs/components/form/button',
        permanent: true,
      },
      {
        source: '/docs/components/form/button-group',
        destination: '/docs/components/form/button',
        permanent: true,
      },
      {
        source: '/docs/components/form/checkbox-card',
        destination: '/docs/components/form/checkbox',
        permanent: true,
      },
      {
        source: '/docs/components/form/checkbox-group',
        destination: '/docs/components/form/checkbox',
        permanent: true,
      },
      {
        source: '/docs/components/form/radio-group',
        destination: '/docs/components/form/radio',
        permanent: true,
      },
    ];
  },
};

export default config;
