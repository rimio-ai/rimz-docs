import type { MetadataRoute } from 'next';
import { getVersionSource } from '@/lib/source';
import { defaultVersion } from '@/lib/versions';
import { absoluteUrl, siteUrl } from '@/lib/shared';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
    },
    ...getVersionSource(defaultVersion).getPages().map((page) => ({
      url: absoluteUrl(`${page.url}/`),
    })),
  ];
}
