import type { MetadataRoute } from 'next';
import { latestSource, source } from '@/lib/source';
import { absoluteUrl, siteUrl } from '@/lib/shared';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
    },
    ...[...latestSource.getPages(), ...source.getPages()].map((page) => ({
      url: absoluteUrl(page.url),
    })),
  ];
}
