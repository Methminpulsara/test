'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { mq } from '@/config/motion';

gsap.registerPlugin(ScrollTrigger);

/**
 * THE THREAD — a continuous SVG line that draws itself along the
 * page with scroll progress, creating a "strand of hair" motif.
 */
export default function Thread() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;

      const mm = gsap.matchMedia();

      mm.add({ desktop: mq.desktop, reduce: mq.reduce }, (ctx) => {
        const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
        if (!desktop || reduce) return;

        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
          },
        });
      });

      return () => mm.revert();
    },
    { dependencies: [] }
  );

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[40] hidden md:block"
      viewBox="0 0 1440 5000"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d="M 720 0 Q 800 200 680 400 Q 560 600 750 800 Q 940 1000 700 1200 Q 460 1400 720 1600 Q 980 1800 680 2000 Q 380 2200 720 2400 Q 1060 2600 700 2800 Q 340 3000 720 3200 Q 1100 3400 680 3600 Q 260 3800 720 4000 Q 1180 4200 720 4400 Q 260 4600 720 4800 L 720 5000"
        stroke="var(--color-coral)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.25"
      />
    </svg>
  );
}
