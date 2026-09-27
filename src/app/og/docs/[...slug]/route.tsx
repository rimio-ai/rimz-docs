import { getAllPages, getPageImage, resolveDocsPage } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';
import { appName } from '@/lib/shared';
import { isDefaultVersion } from '@/lib/versions';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const { version, page } = resolveDocsPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    <DefaultImage
      title={isDefaultVersion(version) ? page.data.title : `${page.data.title} (${version.id})`}
      description={page.data.description}
      site={appName}
    />,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return getAllPages().map(({ version, page }) => ({
    lang: page.locale,
    slug: getPageImage(page, version).segments,
  }));
}
