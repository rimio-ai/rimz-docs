'use client';

import { withBasePath } from '@/lib/shared';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        options: {
          api: withBasePath('/api/search'),
          type: 'static',
        },
      }}
    >
      {children}
    </RootProvider>
  );
}
