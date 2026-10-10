'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { kineticText } from '@/content/site';
import { useSmoothScroll } from '../providers/SmoothScrollProvider';

import { cssVars } from '@/lib/utils';
import { mq } from '@/config/motion';

gsap.registerPlugin(ScrollTrigger);

/**
 * KINETIC TYPE BAND — two rows of giant type travel in opposite directions with
 * scroll, and skew with the scroll velocity reported by Lenis.
 */
export default function KineticBand() {
  const bandRef = useRef<HTMLDivElement>(null);
  const { lenis } = useSmoothScroll();

  useGSAP(
    () => {
      const band = bandRef.current;
      if (!band) return;
      const q = gsap.utils.selector(band);
      const mm = gsap.matchMedia();

      mm.add({ desktop: mq.desktop, mobile: mq.mobile, reduce: mq.reduce }, (ctx) => {
        const { reduce } = ctx.conditions as { desktop: boolean; mobile: boolean; reduce: boolean };
        if (reduce) return;

        gsap.fromTo(
          q('.kb-row-a'),
          { xPercent: 0 },
          { xPercent: -32, ease: 'none', scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: 1 } }
        );
        gsap.fromTo(
          q('.kb-row-b'),
          { xPercent: -32 },
          { xPercent: 0, ease: 'none', scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: 1 } }
        );

        // Velocity skew — eased back to 0 by the shared GSAP ticker
        if (!lenis) return;
        const rows = q('.kb-row');
        const setSkew = gsap.quickSetter(rows, 'skewX', 'deg') as (v: number) => void;
        let current = 0;
        const tick = () => {
          const target = gsap.utils.clamp(-9, 9, lenis.velocity * -0.2);
          current += (target - current) * 0.12;
          setSkew(current);
        };
        gsap.ticker.add(tick);
        return () => {
          gsap.ticker.remove(tick);
        };
      });

      return () => mm.revert();
    },
    { scope: bandRef, dependencies: [lenis] }
  );

  const words = kineticText
    .split('·')
    .map((w) => w.trim())
    .filter(Boolean);
  const rowContent = Array.from({ length: 4 }, () => words).flat();

  const common = {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(3.6rem, 10.5vw, 11rem)',
    lineHeight: 1,
    letterSpacing: '-0.03em',
  } as const;

  return (
    <div
      ref={bandRef}
      className="relative overflow-hidden py-6 md:py-10"
      style={{ backgroundColor: 'var(--color-coral)', color: 'var(--color-cream)' }}
      aria-hidden="true"
    >
      <div className="kb-row kb-row-a flex w-max items-center gap-[0.35em] whitespace-nowrap will-change-transform" style={common}>
        {rowContent.map((w, i) => (
          <span key={i} className="flex items-center gap-[0.35em]">
            <span className={i % 2 ? 'italic' : ''}>{w}</span>
            <span className="text-[0.4em]">✦</span>
          </span>
        ))}
      </div>
      <div
        className="kb-row kb-row-b text-outline flex w-max items-center gap-[0.35em] whitespace-nowrap will-change-transform"
        style={{ ...common, ...cssVars({ '--outline': 'var(--color-cream)' }), }}
      >
        {[...rowContent].reverse().map((w, i) => (
          <span key={i} className="flex items-center gap-[0.35em]">
            <span className={i % 2 ? 'italic' : ''}>{w}</span>
            <span className="text-[0.4em]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
