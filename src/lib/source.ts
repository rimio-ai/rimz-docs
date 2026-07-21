import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute, withBasePath } from './shared';

export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export type DocsSource = typeof source;
export type DocsPage = DocsSource['$inferPage'];

export function getDocsStaticParams() {
  return source.getPages().map((page) => ({ slug: page.slugs }));
}

export function getPageImage(page: DocsPage) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: withBasePath(`${docsImageRoute}/${segments.join('/')}`),
  };
}

export function getPageMarkdownUrl(page: DocsPage) {
  const segments = [...page.slugs, 'content.md'];

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
