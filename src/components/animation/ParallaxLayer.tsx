'use client';

import { useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  direction?: 'vertical' | 'horizontal';
}

/**
 * Moves children at a different scroll speed.
 * speed < 1 = slower than scroll (background feel)
 * speed > 1 = faster than scroll (foreground feel)
 * speed = 1 = normal scroll
 */
export default function ParallaxLayer({
  children,
  speed = 0.5,
  className = '',
  direction = 'vertical',
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: '(min-width: 768px)',
          mobile: '(max-width: 767px)',
          reducedMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { reducedMotion, mobile } = context.conditions!;
          if (reducedMotion) return;

          const actualSpeed = mobile ? speed * 0.4 : speed;
          const distance = 100 * (1 - actualSpeed);
          const prop = direction === 'horizontal' ? 'xPercent' : 'yPercent';

          gsap.fromTo(
            el,
            { [prop]: -distance / 2 },
            {
              [prop]: distance / 2,
              ease: 'none',
              scrollTrigger: {
                trigger: el.parentElement || el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      );

      return () => mm.revert();
    },
    { scope: ref, dependencies: [speed, direction] }
  );

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}
