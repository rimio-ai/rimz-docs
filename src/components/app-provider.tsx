'use client';

import { withBasePath } from '@/lib/shared';
import { searchApiRoute, versionFromPathname } from '@/lib/versions';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function AppProvider({ children }: { children: ReactNode }) {
  const version = versionFromPathname(usePathname());

  return (
    <RootProvider
      search={{
        options: {
          api: withBasePath(searchApiRoute(version)),
          type: 'static',
        },
      }}
    >
      {children}
    </RootProvider>
  );
}
