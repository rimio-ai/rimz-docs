import { getExplicitPages, getLLMText, getPageMarkdownUrl, resolveExplicitPage } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/llms.mdx/docs/[[...slug]]'>) {
  const { slug } = await params;
  const resolved = resolveExplicitPage(slug?.slice(0, -1) ?? []);
  if (!resolved) notFound();

  return new Response(await getLLMText(resolved.page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

export function generateStaticParams() {
  return getExplicitPages().map(({ page, version }) => ({
    lang: page.locale,
    slug: getPageMarkdownUrl(page, version).segments,
  }));
}
