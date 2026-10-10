'use client';

import { useEffect, useState } from 'react';

/** Accent palettes. Only the accent variables change, so contrast stays safe. */
const PALETTES = [
  { id: 'rose', label: 'Rose', coral: '#D4705A', rose: '#B8757E', roseLight: '#D4A0A8' },
  { id: 'lilac', label: 'Lilac', coral: '#9468D0', rose: '#8D6BC0', roseLight: '#C9B2EC' },
  { id: 'sage', label: 'Sage', coral: '#4E9A78', rose: '#5E9B80', roseLight: '#A9D3BE' },
] as const;

const KEY = 'salon-accent';

function apply(id: string) {
  const p = PALETTES.find((x) => x.id === id) ?? PALETTES[0];
  const root = document.documentElement;
  root.style.setProperty('--color-coral', p.coral);
  root.style.setProperty('--color-rose', p.rose);
  root.style.setProperty('--color-rose-light', p.roseLight);
}

/** Small accent-colour changer. Remembers the visitor's choice. */
export default function AccentSwitcher() {
  const [active, setActive] = useState<string>('rose');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved && PALETTES.some((p) => p.id === saved)) {
        // Reading localStorage can only happen after hydration, so state is synced here on purpose.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActive(saved);
        apply(saved);
      }
    } catch {
      /* storage can be unavailable (private mode) — ignore */
    }
  }, []);

  const choose = (id: string) => {
    setActive(id);
    apply(id);
    try {
      localStorage.setItem(KEY, id);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex items-center gap-4" role="group" aria-label="Accent colour">
      <span className="text-xs uppercase tracking-[0.2em] opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
        Accent
      </span>
      {PALETTES.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => choose(p.id)}
          aria-label={`${p.label} accent`}
          aria-pressed={active === p.id}
          className="h-7 w-7 rounded-full border-2 transition-transform duration-300 hover:scale-110 focus-visible:scale-110"
          style={{
            backgroundColor: p.coral,
            borderColor: active === p.id ? 'var(--color-bone)' : 'transparent',
          }}
        />
      ))}
    </div>
  );
}
