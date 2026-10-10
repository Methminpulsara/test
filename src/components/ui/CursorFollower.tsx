'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { mq } from '@/config/motion';

/** data-cursor="view" → shows "View" inside the ring. Unknown / empty values just grow the ring. */
const LABELS: Record<string, string> = {
  view: 'View',
};

const INTERACTIVE = 'a, button, [role="button"], summary, label, input, textarea, select, [data-cursor]';

/**
 * MOUSE EFFECT — a soft coral ring that glides behind the pointer, with a small dot that
 * sticks to it. The ring grows over links / buttons and shows a label on [data-cursor="view"].
 *
 *  • Laptops / desktops only (a real mouse). Phones & tablets never render it.
 *  • No images — just a dot and a ring. The normal system pointer stays visible.
 *  • Skipped for visitors who prefer reduced motion.
 */
export default function CursorFollower() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot || !label) return;
    if (!window.matchMedia(mq.finePointer).matches) return;
    if (window.matchMedia(mq.reduce).matches) return;

    gsap.set([ring, dot], { xPercent: -50, yPercent: -50, x: -100, y: -100, opacity: 0 });

    const ringX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3.out' });
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });

    let visible = false;
    let hovering = false;
    let pressed = false;

    const show = () => {
      if (visible) return;
      visible = true;
      gsap.to([ring, dot], { opacity: 1, duration: 0.3, overwrite: 'auto' });
    };
    const hide = () => {
      visible = false;
      gsap.to([ring, dot], { opacity: 0, duration: 0.3, overwrite: 'auto' });
    };

    const applyState = (text: string) => {
      const big = hovering && text !== '';
      gsap.to(ring, {
        scale: pressed ? (hovering ? 1.6 : 0.75) : hovering ? (big ? 2.4 : 1.8) : 1,
        backgroundColor: big ? 'rgba(212,112,90,0.95)' : hovering ? 'rgba(212,112,90,0.12)' : 'rgba(212,112,90,0)',
        borderColor: big ? 'rgba(212,112,90,0)' : 'rgba(212,112,90,0.9)',
        duration: 0.45,
        ease: 'expo.out',
        overwrite: 'auto',
      });
      gsap.to(dot, { scale: hovering ? 0 : 1, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
      label.textContent = big ? text : '';
      gsap.to(label, { opacity: big ? 1 : 0, duration: 0.25, overwrite: 'auto' });
    };

    let currentText = '';

    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      show();
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
      const wasHovering = hovering;
      hovering = !!target;
      const key = target?.getAttribute('data-cursor') ?? '';
      const text = LABELS[key] ?? '';
      if (hovering !== wasHovering || text !== currentText) {
        currentText = text;
        applyState(text);
      }
    };

    const onDown = () => {
      pressed = true;
      applyState(currentText);
    };
    const onUp = () => {
      pressed = false;
      applyState(currentText);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', hide);
    document.documentElement.addEventListener('mouseenter', show);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', hide);
      document.documentElement.removeEventListener('mouseenter', show);
      gsap.killTweensOf([ring, dot, label]);
    };
  }, []);

  // Hidden until a real mouse moves (so phones / tablets never see it)
  const base = 'pointer-events-none fixed left-0 top-0 z-[10000] opacity-0';

  return (
    <div aria-hidden="true">
      <div
        ref={ringRef}
        className={`${base} flex h-10 w-10 items-center justify-center rounded-full border will-change-transform`}
        style={{ borderColor: 'rgba(212,112,90,0.9)' }}
      >
        <span
          ref={labelRef}
          className="text-[6px] uppercase tracking-[0.2em] opacity-0"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream)' }}
        />
      </div>
      <div
        ref={dotRef}
        className={`${base} h-1.5 w-1.5 rounded-full will-change-transform`}
        style={{ backgroundColor: 'var(--color-coral)' }}
      />
    </div>
  );
}
