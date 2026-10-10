'use client';

import { navigation } from '@/content/site';

interface ChapterIndicatorProps {
  active: string;
  onSelect: (id: string) => void;
}

/** Slim right-edge chapter rail (desktop). Click a number to jump via Lenis. */
export default function ChapterIndicator({ active, onSelect }: ChapterIndicatorProps) {
  return (
    <nav
      className="fixed right-4 top-1/2 z-[90] hidden -translate-y-1/2 flex-col items-end gap-3 text-[var(--color-bone)] mix-blend-difference lg:flex"
      aria-label="Page chapters"
    >
      {navigation.chapters.map((ch) => {
        const isActive = active === ch.number;
        return (
          <button
            key={ch.id}
            onClick={() => onSelect(ch.id)}
            className="group flex items-center gap-3 py-0.5"
            aria-label={`Go to ${ch.label}`}
            aria-current={isActive ? 'true' : undefined}
          >
            <span
              className={`text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${
                isActive ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-70'
              }`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {ch.label}
            </span>
            <span
              className={`block h-px transition-all duration-500 ${isActive ? 'w-8 opacity-100' : 'w-3 opacity-50 group-hover:w-5'}`}
              style={{ backgroundColor: 'currentColor' }}
            />
            <span
              className={`w-5 text-[10px] tabular-nums transition-opacity ${isActive ? 'opacity-100' : 'opacity-50'}`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {ch.number}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
