import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, productGitHubUrl } from './shared';
import { docsVersion, releaseUrl } from './version';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
    },
    githubUrl: productGitHubUrl,
    links: [
      {
        type: 'main',
        text: docsVersion.id,
        url: releaseUrl,
        external: true,
        active: 'none',
      },
    ],
  };
}
