import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, productGitHubUrl } from './shared';
import type { DocsVersion } from './versions';

type VersionSwitch = {
  version: DocsVersion;
  url: string;
};

export function baseOptions(version: DocsVersion, switches: VersionSwitch[]): BaseLayoutProps {
  return {
    nav: {
      title: appName,
    },
    githubUrl: productGitHubUrl,
    links: [
      {
        type: 'menu',
        text: `Docs: ${version.label}`,
        items: switches.map((item) => ({
          text: item.version.label,
          url: item.url,
          active: 'none',
        })),
      },
    ],
  };
}
