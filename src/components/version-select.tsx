'use client';

import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover';
import Link from 'fumadocs-core/link';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

export type VersionOption = {
  id: string;
  label: string;
  description: string;
  /** The current page in that version, or its root when the page is absent. */
  url: string;
};

export function VersionSelect({ current, options }: { current: string; options: VersionOption[] }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.id === current);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="Documentation version"
        className="flex w-full items-center gap-2 rounded-lg border bg-fd-secondary/50 p-2 text-start text-sm text-fd-secondary-foreground transition-colors hover:bg-fd-accent data-[state=open]:bg-fd-accent data-[state=open]:text-fd-accent-foreground"
      >
        <span className="font-medium">{selected?.label ?? current}</span>
        <span className="truncate text-fd-muted-foreground">{selected?.description}</span>
        <ChevronsUpDown className="ms-auto size-4 shrink-0 text-fd-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="flex w-(--radix-popover-trigger-width) flex-col gap-1 p-1 fd-scroll-container">
        {options.map((option) => (
          <Link
            key={option.id}
            href={option.url}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg p-1.5 text-sm hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            <span className="font-medium">{option.label}</span>
            <span className="truncate text-fd-muted-foreground">{option.description}</span>
            <Check
              className={`ms-auto size-3.5 shrink-0 text-fd-primary ${option.id === current ? '' : 'invisible'}`}
            />
          </Link>
        ))}
      </PopoverContent>
    </Popover>
  );
}
