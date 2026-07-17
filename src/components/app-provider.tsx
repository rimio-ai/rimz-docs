'use client';

import { withBasePath } from '@/lib/shared';
import { versionFromPathname } from '@/lib/versions';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function AppProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const version = versionFromPathname(pathname);

  return (
    <RootProvider
      key={version.id}
      search={{
        options: {
          api: withBasePath('/api/search'),
          type: 'static',
          defaultTag: version.id,
        },
      }}
    >
      {children}
    </RootProvider>
  );
}
