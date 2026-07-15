import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

function normalizeBasePath(value) {
  const trimmed = value.trim().replace(/^\/+|\/+$/g, '');

  return trimmed ? `/${trimmed}` : '';
}

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? '');

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(basePath
    ? {
        basePath,
        assetPrefix: `${basePath}/`,
      }
    : {}),
};

export default withMDX(config);
