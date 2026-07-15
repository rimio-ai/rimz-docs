import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, productGitHubUrl } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
    },
    githubUrl: productGitHubUrl,
  };
}
