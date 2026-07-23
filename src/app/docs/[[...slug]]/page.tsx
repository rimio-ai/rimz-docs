import { getDocsStaticParams, getPageImage, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { absoluteUrl, docsGitConfig, docsRoute } from '@/lib/shared';
import { baseOptions } from '@/lib/layout.shared';
import { JsonLd } from '@/components/json-ld';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const canonical = pageCanonical(page.slugs);
  const searchTitle = plainTextTitle(page.data.title);
  const breadcrumbJsonLd =
    page.slugs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'RimZ Documentation',
              item: absoluteUrl(`${docsRoute}/`),
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: searchTitle,
              item: canonical,
            },
          ],
        }
      : undefined;

  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
      {breadcrumbJsonLd ? <JsonLd data={breadcrumbJsonLd} /> : null}
      <DocsPage
        toc={page.data.toc}
        full={page.data.full}
        breadcrumb={{ includeRoot: true, includePage: true }}
      >
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
        <div className="flex flex-row gap-2 items-center border-b pb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${docsGitConfig.user}/${docsGitConfig.repo}/blob/${docsGitConfig.branch}/content/docs/${page.path}`}
          />
        </div>
        <DocsBody>
          <MDX
            components={getMDXComponents({
              a: createRelativeLink(source, page),
            })}
          />
        </DocsBody>
      </DocsPage>
    </DocsLayout>
  );
}

export async function generateStaticParams() {
  return getDocsStaticParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const canonical = pageCanonical(page.slugs);
  const isIntroduction = page.slugs.length === 0;

  return {
    title: isIntroduction
      ? { absolute: 'RimZ Documentation: Installation, CLI, and Agent Guides' }
      : plainTextTitle(page.data.title),
    description: page.data.description,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      images: absoluteUrl(getPageImage(page).url),
    },
  };
}

function pageCanonical(slugs: string[]) {
  return absoluteUrl(`${docsRoute}${slugs.length > 0 ? `/${slugs.join('/')}` : ''}/`);
}

function plainTextTitle(title: string) {
  return title.replace(/`([^`]+)`/g, '$1');
}
