'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { angles } from '@/content/site';
import { mq } from '@/config/motion';

gsap.registerPlugin(ScrollTrigger);

// "The Mirror": an oval opens in the first photo and grows to full-bleed.
const MIRROR = 'inset(30% 37% 30% 37% round 26vw 26vw 26vw 26vw)';
const MIRROR_MOBILE = 'inset(30% 18% 30% 18% round 41vw 41vw 41vw 41vw)';
const FULL = 'inset(0% 0% 0% 0% round 0vw 0vw 0vw 0vw)';

/**
 * Scroll-controlled image-to-image mask reveal. The two photos share the same
 * backdrop but are NOT presented as before/after (they're not a real pair).
 */
export default function TransformReveal() {
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
          if (reduce) {
            gsap.set(q('.angle-to'), { clipPath: FULL });
            return;
          }
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: desktop ? '+=130%' : '+=110%',
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          tl.fromTo(q('.angle-to'), { clipPath: desktop ? MIRROR : MIRROR_MOBILE }, { clipPath: FULL, duration: 1, ease: 'power2.inOut' }, 0)
            .fromTo(q('.angle-to-img'), { scale: 1.35 }, { scale: 1, duration: 1 }, 0)
            .fromTo(q('.angle-from-img'), { scale: 1 }, { scale: 1.12, duration: 1 }, 0)
            .to(q('.angle-label-a'), { opacity: 0, y: -20, duration: 0.3 }, 0.25)
            .fromTo(q('.angle-label-b'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 0.7);
        }
      );

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [] }
  );

  const lines = angles.headline.split('\n');

  return (
    <section
      ref={sectionRef}
      id="angles"
      data-theme="dark"
      className="relative h-[100svh] w-full overflow-hidden"
      style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-bone)' }}
    >
      {/* Photo A (base) */}
      <div className="absolute inset-0">
        <div className="angle-from-img absolute inset-0">
          <Image src={angles.from.src} alt={angles.from.alt} fill sizes="100vw" className="object-cover" style={{ objectPosition: '50% 35%' }} />
        </div>
        <div className="absolute inset-0" style={{ background: 'rgba(26,17,24,0.35)' }} />
      </div>

      {/* Photo B (revealed through the mirror) */}
      <div className="angle-to absolute inset-0" style={{ clipPath: MIRROR }}>
        <div className="angle-to-img absolute inset-0">
          <Image src={angles.to.src} alt={angles.to.alt} fill sizes="100vw" className="object-cover" style={{ objectPosition: '50% 30%' }} />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,17,24,0.55), rgba(26,17,24,0.05) 55%)' }} />
      </div>

      {/* Copy */}
      <div className="fluid-pad-x pointer-events-none absolute inset-x-0 bottom-0 z-10 pb-[8vh]">
        <h2
          className="mb-6 leading-[0.9]"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 9vw, 10rem)', letterSpacing: '-0.035em' }}
        >
          {lines.map((l, i) => (
            <span key={i} className={`block ${i === 1 ? 'italic' : ''}`}>
              {l}
            </span>
          ))}
        </h2>
        <div className="relative h-5 text-[11px] uppercase tracking-[0.3em]" style={{ fontFamily: 'var(--font-body)' }}>
          <span className="angle-label-a absolute left-0 top-0">{angles.from.label}</span>
          <span className="angle-label-b absolute left-0 top-0 opacity-0">{angles.to.label}</span>
        </div>
      </div>
    </section>
  );
}
