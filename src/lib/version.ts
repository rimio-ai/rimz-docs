import versionJson from '../../content/version.json';
import { productGitHubUrl } from './shared';

export type DocsVersion = {
  schemaVersion: 2;
  /** The release tag the published documentation was built from, such as `v0.4.1`. */
  id: string;
  ref: string;
  sourceCommit: string;
};

export const docsVersion = versionJson as DocsVersion;
export const releaseUrl = `${productGitHubUrl}/releases/tag/${docsVersion.ref}`;
