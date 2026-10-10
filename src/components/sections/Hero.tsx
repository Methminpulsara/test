'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { hero } from '@/content/site';
import { mq } from '@/config/motion';

gsap.registerPlugin(ScrollTrigger);

// Clip-path shapes. Same structure on both ends so GSAP can interpolate them.
const ARCH_DESKTOP = 'inset(13% 33% 9% 33% round 17vw 17vw 0vw 0vw)';
const ARCH_MOBILE = 'inset(20% 11% 14% 11% round 39vw 39vw 0vw 0vw)';
const FULL = 'inset(0% 0% 0% 0% round 0vw 0vw 0vw 0vw)';

/**
 * HERO "OPENING"
 * Layers (back → front), each moving at its own scroll speed:
 *   1. giant headline lines   – drift apart sideways
 *   2. arch-masked photo      – clip-path opens to full-bleed, image scales 1.3 → 1
 *   3. small foreground chips – rise at 3 different speeds
 *   4. caption                – arrives once the photo is full-bleed
 */
export default function Hero() {
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
          mobile: mq.mobile, // keeps the callback running on phones (see config/motion.ts)
          reduce: mq.reduce,
        },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
          if (reduce) return; // static, fully readable layout

          // ── Entrance (line masks + arch rising) ──
          gsap.from(q('.hero-line-inner'), { yPercent: 115, duration: 1.3, stagger: 0.12, ease: 'expo.out', delay: 0.15 });
          gsap.from(q('.hero-stage'), { yPercent: 8, opacity: 0, duration: 1.6, ease: 'expo.out' });
          gsap.from(q('.hero-chip-in'), { scale: 0.6, opacity: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out', delay: 0.5 });
          gsap.from(q('.hero-meta-in'), { opacity: 0, y: 14, duration: 1, delay: 0.9, ease: 'power3.out' });

          // ── Scroll-scrubbed scene ──
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: desktop ? '+=140%' : '+=120%',
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          tl.fromTo(q('.hero-stage'), { clipPath: desktop ? ARCH_DESKTOP : ARCH_MOBILE }, { clipPath: FULL, duration: 0.8, ease: 'power2.inOut' }, 0)
            .fromTo(q('.hero-stage-img'), { scale: 1.3 }, { scale: 1, duration: 1 }, 0)
            // headline: opposite directions
            .to(q('.hero-line-1'), { x: '-28vw', duration: 0.8 }, 0)
            .to(q('.hero-line-2'), { x: '24vw', duration: 0.8 }, 0)
            .to(q('.hero-line-3'), { x: '-20vw', duration: 0.8 }, 0)
            // foreground chips at 3 different speeds
            .to(q('.hero-chip-a'), { yPercent: -340, duration: 1 }, 0)
            .to(q('.hero-chip-b'), { yPercent: -190, duration: 1 }, 0)
            .to(q('.hero-ring'), { yPercent: -90, scale: 1.4, duration: 1 }, 0)
            .to(q('.hero-meta'), { opacity: 0, duration: 0.2 }, 0)
            .fromTo(q('.hero-caption'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 0.62)
            .to(q('.hero-line'), { opacity: 0, duration: 0.25 }, 0.6);

          // ── Mouse parallax (laptops / desktops with a real pointer only) ──
          // Uses x/y only, so it never fights the scroll tweens (yPercent / scale / clipPath).
          if (window.matchMedia(mq.finePointer).matches) {
            const layers: [string, number][] = [
              ['.hero-stage-img', 14],
              ['.hero-chip-in', -34],
              ['.hero-ring', 46],
              ['.hero-line-inner', 10],
            ];
            const movers = layers.flatMap(([sel, amt]) =>
              q(sel).map((el: Element) => ({
                amt,
                x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' }),
                y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' }),
              }))
            );
            const onMove = (e: MouseEvent) => {
              const nx = (e.clientX / window.innerWidth - 0.5) * 2;
              const ny = (e.clientY / window.innerHeight - 0.5) * 2;
              movers.forEach((m) => {
                m.x(nx * m.amt);
                m.y(ny * m.amt);
              });
            };
            section.addEventListener('mousemove', onMove);
            return () => section.removeEventListener('mousemove', onMove);
          }
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [] }
  );

  const lineStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(4.4rem, 17.5vw, 19rem)',
    lineHeight: 0.86,
    letterSpacing: '-0.04em',
    color: 'var(--color-ink)',
  } as const;

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-theme="light"
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden"
      style={{ backgroundColor: 'var(--color-cream)' }}
    >
      {/* 1 — Giant headline (behind the arch) */}
      <h1
        className="fluid-pad-x absolute inset-0 z-10 flex select-none flex-col justify-center"
        aria-label={hero.headline.join(' ')}
      >
        <span className="hero-line hero-line-1 block w-fit overflow-hidden pb-[0.1em]" aria-hidden="true">
          <span className="hero-line-inner block" style={lineStyle}>
            {hero.headline[0]}
          </span>
        </span>
        <span className="hero-line hero-line-2 ml-auto block w-fit overflow-hidden pb-[0.1em]" aria-hidden="true">
          <span className="hero-line-inner block italic" style={{ ...lineStyle, color: 'var(--color-rose)' }}>
            {hero.headline[1]}
          </span>
        </span>
        <span className="hero-line hero-line-3 ml-[5vw] block w-fit overflow-hidden pb-[0.1em]" aria-hidden="true">
          <span className="hero-line-inner block" style={lineStyle}>
            {hero.headline[2]}
          </span>
        </span>
      </h1>

      {/* 2 — Arch-masked photo that opens to full-bleed */}
      <div className="hero-stage pointer-events-none absolute inset-0 z-20">
        <div className="hero-stage-img absolute -inset-[2.5%] will-change-transform">
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: hero.focus }}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(26,17,24,0.5) 0%, rgba(26,17,24,0) 45%)' }}
        />
      </div>

      {/* 3 — Foreground details (fastest layers) */}
      <div className="hero-chip-a pointer-events-none absolute bottom-[7vh] left-[5vw] z-30 w-[24vw] md:w-[13vw]">
        <div
          className="hero-chip-in relative aspect-[3/4] w-full overflow-hidden"
          style={{ clipPath: 'inset(0 round 999px 999px 0 0)' }}
        >
          <Image src="/images/updo.jpg" alt="" fill sizes="(max-width: 768px) 24vw, 13vw" className="object-cover" style={{ objectPosition: '70% 40%' }} />
        </div>
      </div>
      <div className="hero-chip-b pointer-events-none absolute right-[6vw] top-[16vh] z-30 w-[20vw] md:w-[9vw]">
        <div className="hero-chip-in relative aspect-square w-full overflow-hidden rounded-full">
          <Image src="/images/natural.jpg" alt="" fill sizes="(max-width: 768px) 20vw, 9vw" className="object-cover" />
        </div>
      </div>
      <div
        className="hero-ring pointer-events-none absolute left-[46vw] top-[7vh] z-30 hidden h-[16vw] w-[16vw] rounded-full border md:block"
        style={{ borderColor: 'var(--color-rose)', opacity: 0.55 }}
        aria-hidden="true"
      />

      {/* Small meta line (fades out on scroll) */}
      <div className="hero-meta pointer-events-none absolute bottom-6 right-[4vw] z-30 text-right">
        <p
          className="hero-meta-in text-[11px] uppercase tracking-[0.3em] md:text-xs"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)' }}
        >
          {hero.subline}
          <span className="mt-2 block opacity-60">Scroll ↓</span>
        </p>
      </div>

      {/* 4 — Caption that arrives on the full-bleed photo */}
      <div className="hero-caption pointer-events-none absolute inset-x-0 bottom-0 z-40 fluid-pad-x pb-[9vh] opacity-0">
        <p
          className="max-w-[16ch] italic leading-[0.95]"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 6vw, 6.5rem)', color: 'var(--color-bone)' }}
        >
          {hero.subline}
        </p>
      </div>
    </section>
  );
}
