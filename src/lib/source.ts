import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, withBasePath } from './shared';
import {
  docsVersions,
  splitVersion,
  versionBaseUrl,
  versionSegments,
  type DocsVersion,
} from './versions';

const collection = docs.toFumadocsSource();

function createVersionSource(version: DocsVersion) {
  const prefix = `${version.id}/`;
  const files = collection.files
    .filter((file) => file.path.startsWith(prefix))
    .map((file) => ({ ...file, path: file.path.slice(prefix.length) }));

  return loader({
    baseUrl: versionBaseUrl(version),
    source: { files: files as typeof collection.files },
    plugins: [lucideIconsPlugin()],
  });
}

export type DocsSource = ReturnType<typeof createVersionSource>;
export type DocsPage = DocsSource['$inferPage'];

const sources = new Map(docsVersions.map((version) => [version.id, createVersionSource(version)]));

export function getVersionSource(version: DocsVersion) {
  const versionSource = sources.get(version.id);
  if (!versionSource) throw new Error(`missing content source for ${version.id}`);
  return versionSource;
}

/** Resolves `[version?, ...slugs]` below a docs route to its page. */
export function resolveDocsPage(segments: string[] | undefined) {
  const { version, rest } = splitVersion(segments);
  const source = getVersionSource(version);

  return { version, source, page: source.getPage(rest) };
}

export function getAllPages() {
  return docsVersions.flatMap((version) => {
    const source = getVersionSource(version);
    return source.getPages().map((page) => ({ version, source, page }));
  });
}

export function getDocsStaticParams() {
  return getAllPages().map(({ version, page }) => ({
    slug: [...versionSegments(version), ...page.slugs],
  }));
}

/** Where each version's dropdown entry leads: the same page, or its root. */
export function getVersionSwitches(slugs: string[]) {
  return docsVersions.map((version) => {
    const exists = getVersionSource(version).getPage(slugs) !== undefined;
    const target = exists ? slugs : [];

    return {
      version,
      url: `${[versionBaseUrl(version), ...target].join('/')}/`,
    };
  });
}

export function getPageImage(page: DocsPage, version: DocsVersion) {
  const segments = [...versionSegments(version), ...page.slugs, 'image.png'];

  return {
    segments,
    url: withBasePath(`${docsImageRoute}/${segments.join('/')}`),
  };
}

export function getPageMarkdownUrl(page: DocsPage, version: DocsVersion) {
  const segments = [...versionSegments(version), ...page.slugs, 'content.md'];

  return {
    segments,
    url: withBasePath(`${docsContentRoute}/${segments.join('/')}`),
  };
}

export async function getLLMText(page: DocsPage) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
