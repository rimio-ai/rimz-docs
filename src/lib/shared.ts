export const appName = 'RimZ';
export const appDescription =
  'RimZ is an open-source realtime dashboard and control room for running and steering fleets of coding agents in tmux and Zellij.';

function normalizeBasePath(value: string | undefined) {
  const trimmed = value?.trim().replace(/^\/+|\/+$/g, '') ?? '';

  return trimmed ? `/${trimmed}` : '';
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, '');
}

export const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
export const siteUrl = trimTrailingSlash(
  process.env.NEXT_PUBLIC_SITE_URL ?? `https://rimz.rimio.ai${basePath}`,
);

export function withBasePath(path: string) {
  if (!basePath || path.match(/^\w+:/) || path.startsWith('//')) return path;
  if (path === basePath || path.startsWith(`${basePath}/`)) return path;

  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`;
}

export function absoluteUrl(path: string) {
  if (path.match(/^\w+:/)) return path;

  return new URL(withBasePath(path), siteUrl).toString();
}

export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

export const docsGitConfig = {
  user: 'rimio-ai',
  repo: 'rimz-docs',
  branch: 'main',
};

export const productGitHubUrl = 'https://github.com/rimio-ai/rimz';
