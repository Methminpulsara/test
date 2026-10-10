'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { testimonials, contact, instagramTiles } from '@/content/site';
import { mq } from '@/config/motion';

gsap.registerPlugin(ScrollTrigger);

// Phones: a tidy 2-column grid (same ratio, right column dropped a little so it still feels editorial).
// md and up: the mixed ratios / offsets of the 3-column layout.
const TILE_ASPECT = ['md:aspect-[3/4]', 'md:aspect-square', 'md:aspect-[4/5]', 'md:aspect-square', 'md:aspect-[3/4]', 'md:aspect-[4/5]'];
const TILE_OFFSET = ['', 'mt-8 md:mt-14', '', 'mt-8 md:mt-6', 'md:mt-16', 'mt-8 md:mt-4'];

/**
 * Real testimonials only (from /content). With none, this is a "follow along"
 * block using the studio's own photos — no invented reviews.
 */
export default function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const hasTestimonials = testimonials.length > 0;

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      mm.add({ reduce: mq.reduce, mobile: mq.mobile, desktop: mq.desktop }, (ctx) => {
        const { reduce, mobile } = ctx.conditions as { reduce: boolean; mobile: boolean };
        if (reduce) return;

        // Headline: line-mask rise
        gsap.from(q('.social-line-inner'), {
          yPercent: 115,
          duration: 1.1,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 85%', once: true },
        });

        // Tiles: each one is revealed as IT enters the screen (not tied to one far-away trigger),
        // so a fast flick of the thumb can never leave the grid blank.
        const tiles = q('.social-tile') as HTMLElement[];
        gsap.set(tiles, { clipPath: 'inset(100% 0% 0% 0%)' });
        ScrollTrigger.batch(tiles, {
          start: 'top 96%',
          once: true,
          interval: 0.1,
          batchMax: 3,
          onEnter: (batch) =>
            gsap.to(batch, {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.1,
              stagger: 0.1,
              ease: 'expo.out',
              overwrite: true,
            }),
        });

        // Gentle drift: alternate tiles move in opposite directions while they cross the screen
        const amp = mobile ? 4 : 6;
        q('.social-tile-img').forEach((el: Element, i: number) => {
          gsap.fromTo(
            el,
            { yPercent: i % 2 ? amp : -amp },
            {
              yPercent: i % 2 ? -amp : amp,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      id="social"
      data-theme="light"
      className="relative fluid-pad-x fluid-pad-y"
      style={{ backgroundColor: 'var(--color-bone)', color: 'var(--color-ink)' }}
    >
      <div className="mb-12 grid items-end gap-8 md:mb-16 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="mb-4 text-xs uppercase tracking-[0.3em]" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-rose)' }}>
            {hasTestimonials ? '05 — Kind Words' : '05 — Follow Along'}
          </p>
          <h2 className="leading-[0.9]" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 9vw, 9.5rem)', letterSpacing: '-0.04em' }}>
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="social-line-inner block">{hasTestimonials ? 'In their' : 'Follow'}</span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="social-line-inner block italic text-[var(--color-rose)]">{hasTestimonials ? 'own words' : 'the work'}</span>
            </span>
          </h2>
        </div>
        <div className="md:col-span-4 md:flex md:justify-end">
          <a
            href={contact.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full border px-7 py-4 text-xs uppercase tracking-[0.2em] transition-colors duration-300 hover:border-[var(--color-coral)] hover:bg-[var(--color-coral)] hover:text-[var(--color-cream)]"
            style={{ fontFamily: 'var(--font-body)', borderColor: 'var(--color-ink)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.3" cy="6.7" r="0.8" fill="currentColor" />
            </svg>
            Follow on Instagram
          </a>
        </div>
      </div>

      {hasTestimonials && (
        <div className="mb-14 grid gap-10 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <blockquote key={i}>
              <p className="mb-4 text-2xl leading-snug md:text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <cite className="text-sm not-italic opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
                {t.name}
                {t.detail ? ` — ${t.detail}` : ''}
              </cite>
            </blockquote>
          ))}
        </div>
      )}

      <div className="social-grid grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-5">
        {instagramTiles.map((src, i) => (
          <a
            key={src}
            href={contact.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the studio's Instagram"
            data-cursor="view"
            className={`social-tile group relative block aspect-[4/5] overflow-hidden rounded-sm md:col-span-2 ${TILE_ASPECT[i % TILE_ASPECT.length]} ${TILE_OFFSET[i % TILE_OFFSET.length]}`}
          >
            <div className="social-tile-img absolute -inset-y-[8%] inset-x-0">
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
