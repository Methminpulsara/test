'use client';

import { useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface RevealLinesProps {
  children: ReactNode;
  className?: string;
  /** Delay in seconds before animation starts */
  delay?: number;
  /** Use scroll trigger instead of immediate */
  scroll?: boolean;
  /** Stagger duration between lines */
  stagger?: number;
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

/**
 * Wraps each direct child in a line-mask container and reveals
 * them with a y-translate from below. If scroll=true, triggers
 * on scroll enter.
 */
export default function RevealLines({
  children,
  className = '',
  delay = 0,
  scroll = false,
  stagger = 0.1,
  as: Tag = 'div',
}: RevealLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const lines = container.querySelectorAll('.reveal-line-inner');
      if (!lines.length) return;

      const tl = gsap.timeline({
        scrollTrigger: scroll
          ? {
              trigger: container,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            }
          : undefined,
        delay: scroll ? 0 : delay,
      });

      tl.fromTo(
        lines,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger,
          ease: 'expo.out',
        }
      );
    },
    { scope: containerRef, dependencies: [delay, scroll, stagger] }
  );

  // Wrap each child in a line-mask
  const childArray = Array.isArray(children) ? children : [children];

  return (
    <Tag ref={containerRef as React.Ref<HTMLDivElement>} className={className}>
      {childArray.map((child, i) => (
        <span key={i} className="line-mask inline-block">
          <span className="reveal-line-inner inline-block opacity-0">{child}</span>
        </span>
      ))}
    </Tag>
  );
}
