'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { philosophy } from '@/content/site';
import { cssVars } from '@/lib/utils';
import { mq } from '@/config/motion';

gsap.registerPlugin(ScrollTrigger);

// Start shapes live in CSS (.story-arch) so first paint is correct; GSAP animates to FULL.
const ARCH_DESKTOP = 'inset(14% 7% 14% 61% round 16vw 16vw 0vw 0vw)';
const ARCH_MOBILE = 'inset(44% 14% 7% 14% round 36vw 36vw 0vw 0vw)';
const FULL = 'inset(0% 0% 0% 0% round 0vw 0vw 0vw 0vw)';
const WIPE_FROM = 'polygon(0% 0%, 0% 0%, -30% 100%, -30% 100%)';
const WIPE_TO = 'polygon(0% 0%, 130% 0%, 100% 100%, -30% 100%)';
const SCENE_FULL = 'inset(0% 0% 0% 0% round 0vw)';
const SCENE_CARD = 'inset(0% 0% 0% 0% round 4vw)';

/**
 * PINNED STORY "PHILOSOPHY" — works on phones, tablets and laptops.
 * ONE scrubbed timeline (10 units), pinned ~500vh. Works in both directions.
 *   0 – 2    words of the statement light up one by one
 *   2 – 4    the arch photo opens to the full viewport
 *   4 – 7.4  a giant outlined word crosses the screen, rotating
 *   5 – 7    second photo wipes in through a diagonal mask
 *   6.4 – 8  text swaps (line-mask transition)
 *   8.4 – 10 whole scene shrinks to a card and hands off to the next section
 * prefers-reduced-motion: a calm stacked layout (no pin, no scrub).
 */
export default function PinnedStory() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: mq.desktop,
          mobile: mq.mobile,
          reduce: mq.reduce,
        },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
          if (reduce) return;

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: '+=500%',
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // Stage 1 — words light up
          tl.to(q('.story-word'), { opacity: 1, duration: 0.45, stagger: 0.25 }, 0);

          // Stage 2 — arch → full viewport
          tl.fromTo(q('.story-arch'), { clipPath: desktop ? ARCH_DESKTOP : ARCH_MOBILE }, { clipPath: FULL, duration: 2, ease: 'power2.inOut' }, 2)
            .fromTo(q('.story-arch-img'), { scale: 1.25 }, { scale: 1, duration: 2 }, 2)
            .to(q('.story-arch-shade'), { opacity: 1, duration: 2 }, 2);

          // Stage 3 — giant foreground word moves / rotates against the background
          tl.fromTo(q('.story-big-word'), { x: '75vw', rotation: -7 }, { x: '-90vw', rotation: 3, duration: 3.4 }, 4);

          // Stage 4 — second photo wipes in through a diagonal mask
          tl.fromTo(q('.story-img2'), { clipPath: WIPE_FROM }, { clipPath: WIPE_TO, duration: 2, ease: 'power2.inOut' }, 5)
            .fromTo(q('.story-img2-inner'), { scale: 1.3 }, { scale: 1, duration: 2 }, 5);

          // Stage 5 — text swap with line masks
          tl.to(q('.story-text-a'), { yPercent: -40, opacity: 0, duration: 1, ease: 'power2.in' }, 6.4)
            .fromTo(q('.story-line-inner'), { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.25, ease: 'power3.out' }, 7)
            .to(q('.story-big-word'), { opacity: 0, duration: 0.6 }, 7.4);

          // Stage 6 — shrink and hand off to the next chapter
          tl.fromTo(
            q('.story-scene'),
            { clipPath: SCENE_FULL, scale: 1 },
            { clipPath: SCENE_CARD, scale: 0.9, duration: 1.6, ease: 'power2.inOut' },
            8.4
          );
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [] }
  );

  const stmt = philosophy.statements;
  const words = stmt[0].split(' ');
  const third = stmt[2].split(' ');
  const mid = Math.ceil(third.length / 2);
  const lines = [third.slice(0, mid).join(' '), third.slice(mid).join(' ')];

  const displayStyle = { fontFamily: 'var(--font-display)' } as const;

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      data-theme="dark"
      className="relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-bone)' }}
    >
      {/* ───────── Pinned, scrubbed scene (all screen sizes) ───────── */}
      <div
        className="story-scene relative h-[100svh] w-full overflow-hidden motion-reduce:hidden"
        style={{ backgroundColor: 'var(--color-mulberry)' }}
      >
        <p
          className="absolute left-[5vw] top-[13svh] z-30 text-xs uppercase tracking-[0.3em] opacity-70 md:left-[4vw] md:top-[14vh]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          02 — Philosophy
        </p>

        {/* Photo 1: arch → full viewport */}
        <div className="story-arch absolute inset-0 z-0">
          <div className="story-arch-img absolute inset-0">
            <Image src={philosophy.images[0]} alt={philosophy.imageAlts[0]} fill sizes="100vw" className="object-cover" />
          </div>
          <div className="story-arch-shade absolute inset-0 opacity-0" style={{ background: 'rgba(61,26,56,0.55)' }} />
        </div>

        {/* Photo 2: diagonal wipe */}
        <div className="story-img2 absolute inset-0 z-10" style={{ clipPath: WIPE_FROM }}>
          <div className="story-img2-inner absolute inset-0">
            <Image src={philosophy.images[1]} alt={philosophy.imageAlts[1]} fill sizes="100vw" className="object-cover" style={{ objectPosition: '50% 35%' }} />
          </div>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(61,26,56,0.7), rgba(61,26,56,0.2))' }} />
        </div>

        {/* Statement A: words light up */}
        <div className="story-text-a absolute inset-0 z-20 flex items-start pt-[22svh] md:items-center md:pt-0">
          <p
            className="fluid-pad-x max-w-[92vw] leading-[1.02] md:max-w-[56vw]"
            style={{ ...displayStyle, fontSize: 'clamp(2.5rem, 6.4vw, 7rem)', letterSpacing: '-0.02em' }}
          >
            {words.map((w, i) => (
              <span key={i} className="story-word mr-[0.25em] inline-block opacity-[0.18]">
                {w}
              </span>
            ))}
          </p>
        </div>

        {/* Statement B: line-mask swap */}
        <div className="absolute inset-x-0 bottom-[14svh] z-20 fluid-pad-x md:bottom-[12vh]">
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <span className="story-line-inner block italic leading-[1]" style={{ ...displayStyle, fontSize: 'clamp(2.2rem, 5.6vw, 6.2rem)' }}>
                {line}
              </span>
            </span>
          ))}
        </div>

        {/* Giant foreground word */}
        <div
          className="story-big-word text-outline pointer-events-none absolute bottom-[-3vw] left-0 z-30 select-none whitespace-nowrap leading-[0.8]"
          style={{
            ...displayStyle,
            fontSize: 'clamp(9rem, 30vw, 32rem)',
            ...cssVars({ '--outline': 'var(--color-rose-light)' }),
          }}
          aria-hidden="true"
        >
          {philosophy.bigWord}
        </div>
      </div>

      {/* ───────── Reduced motion: calm stacked story ───────── */}
      <div className="fluid-pad-x hidden space-y-14 py-20 motion-reduce:block">
        <p className="text-xs uppercase tracking-[0.3em] opacity-70" style={{ fontFamily: 'var(--font-body)' }}>
          02 — Philosophy
        </p>
        <p className="leading-[1.05]" style={{ ...displayStyle, fontSize: 'clamp(2.4rem, 7vw, 4.5rem)' }}>
          {stmt[0]}
        </p>
        <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden" style={{ clipPath: 'inset(0 round 999px 999px 0 0)' }}>
          <Image src={philosophy.images[0]} alt={philosophy.imageAlts[0]} fill sizes="(max-width: 768px) 100vw, 28rem" className="object-cover" />
        </div>
        <p className="italic leading-[1.1]" style={{ ...displayStyle, fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>
          {stmt[1]}
        </p>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl">
          <Image src={philosophy.images[1]} alt={philosophy.imageAlts[1]} fill sizes="(max-width: 768px) 100vw, 28rem" className="object-cover" style={{ objectPosition: '50% 35%' }} />
        </div>
        <p className="leading-[1.1]" style={{ ...displayStyle, fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>
          {stmt[2]}
        </p>
        <p className="opacity-70" style={{ fontFamily: 'var(--font-body)' }}>
          {stmt[3]} {stmt[4]}
        </p>
      </div>
    </section>
  );
}
