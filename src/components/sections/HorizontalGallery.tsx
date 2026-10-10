'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { galleryItems } from '@/content/site';
import { cssVars } from '@/lib/utils';
import { mq } from '@/config/motion';

gsap.registerPlugin(ScrollTrigger);

// Frame size per aspect. Heights use svh on phones so the mobile browser's
// address bar never resizes the scene mid-scroll.
const FRAME: Record<string, string> = {
  portrait: 'h-[54svh] aspect-[3/4] md:h-[66vh]',
  landscape: 'h-[34svh] aspect-[4/3] md:h-[48vh]',
  square: 'h-[42svh] aspect-square md:h-[54vh]',
};
// Staggered vertical offsets + mask shapes, mixed on purpose
const OFFSET = [
  '-translate-y-[3svh] md:-translate-y-[4vh]',
  'translate-y-[4svh] md:translate-y-[7vh]',
  '-translate-y-[4svh] md:-translate-y-[8vh]',
  'translate-y-[3svh] md:translate-y-[5vh]',
  '-translate-y-[2svh] md:-translate-y-[2vh]',
  'translate-y-[4svh] md:translate-y-[8vh]',
  '-translate-y-[3svh] md:-translate-y-[5vh]',
];
const SHAPE = ['999px 999px 0 0', '0.5rem', '999px', '0.5rem', '999px 999px 0 0', '0.5rem', '999px'];

/**
 * SIGNATURE LOOKS — on every screen size, vertical scroll drives a wide track
 * sideways while the section is pinned. Distance = scrollWidth − innerWidth
 * (recomputed on refresh) so it always stops exactly on the last image.
 * Each photo parallaxes inside its frame; oversized numbers drift at their own
 * speed. Reduced motion: the track becomes a native swipe row.
 */
export default function HorizontalGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      mm.add({ desktop: mq.desktop, mobile: mq.mobile, reduce: mq.reduce }, (ctx) => {
        const { reduce } = ctx.conditions as { desktop: boolean; mobile: boolean; reduce: boolean };
        if (reduce) return;

        const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(track, { x: () => -getDistance(), duration: 1 }, 0);
        tl.fromTo(q('.gallery-img-inner'), { xPercent: -9 }, { xPercent: 9, duration: 1 }, 0);
        tl.fromTo(q('.gallery-num'), { x: 120 }, { x: -120, duration: 1 }, 0);
        tl.fromTo(q('.gallery-intro-word'), { x: 0 }, { x: -200, duration: 1 }, 0);
        tl.fromTo(q('.gallery-progress'), { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      id="looks"
      data-theme="dark"
      className="relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-bone)' }}
    >
      <div className="no-scrollbar relative flex h-[100svh] items-center motion-reduce:snap-x motion-reduce:overflow-x-auto">
        {/* Track */}
        <div ref={trackRef} className="flex w-max shrink-0 items-center gap-[12vw] px-[7vw] md:gap-[7vw] md:px-[8vw]">
          {/* Intro panel */}
          <div className="relative w-[78vw] shrink-0 md:w-[42vw]">
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-[var(--color-rose-light)]" style={{ fontFamily: 'var(--font-body)' }}>
              03 — Signature Looks
            </p>
            <h2
              className="gallery-intro-word leading-[0.85]"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 12vw, 13rem)', letterSpacing: '-0.04em' }}
            >
              Signature
              <br />
              <span className="italic text-[var(--color-rose)]">Looks</span>
            </h2>
            <p className="mt-6 max-w-xs text-sm opacity-70" style={{ fontFamily: 'var(--font-body)' }}>
              Keep scrolling — the gallery glides sideways. Every look is shaped to the person wearing it.
            </p>
          </div>

          {galleryItems.map((item, i) => (
            <figure
              key={item.src}
              className={`group relative shrink-0 snap-center ${FRAME[item.aspect]} ${OFFSET[i % OFFSET.length]}`}
            >
              {/* oversized outline number drifting at its own speed */}
              <span
                className="gallery-num text-outline pointer-events-none absolute -left-2 -top-[4.5rem] z-10 select-none leading-none md:-left-[3vw] md:-top-[9vh]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(4.5rem, 11vw, 11rem)',
                  ...cssVars({ '--outline': 'var(--color-rose)' }),
                }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: SHAPE[i % SHAPE.length] }}>
                <div className="gallery-img-inner absolute inset-y-0 -left-[12.5%] w-[125%]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 80vw, 40vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    style={{ objectPosition: item.focus ?? '50% 50%' }}
                  />
                </div>
              </div>

              <figcaption className="absolute left-0 right-0 top-full mt-3 flex items-baseline justify-between text-xs uppercase tracking-[0.2em] opacity-70" style={{ fontFamily: 'var(--font-body)' }}>
                <span>{item.caption}</span>
                <span className="tabular-nums">
                  {String(i + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}
                </span>
              </figcaption>
            </figure>
          ))}

          {/* breathing room so the last frame lands fully in view */}
          <div className="w-[2vw] shrink-0" aria-hidden="true" />
        </div>

        {/* Thread-style progress line */}
        <div className="pointer-events-none absolute inset-x-[7vw] bottom-[6svh] h-px bg-[var(--color-mulberry-light)] md:inset-x-[8vw]" aria-hidden="true">
          <div className="gallery-progress h-full origin-left bg-[var(--color-coral)]" />
        </div>
      </div>
    </section>
  );
}
