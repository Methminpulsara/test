'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { services, brand, contact } from '@/content/site';
import { waLink } from '@/lib/utils';
import { mq } from '@/config/motion';

gsap.registerPlugin(ScrollTrigger);

/**
 * SERVICES "THE MENU" — an editorial list, not cards.
 * Hover / focus / tap swaps the sticky image stage with a clip-path wipe.
 * On mobile the same list is an accordion and each open item carries its photo.
 */
export default function ServicesList() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(0);
  const [open, setOpen] = useState<number | null>(0);

  const select = (i: number) => {
    if (i === active) return;
    setPrev(active);
    setActive(i);
  };

  // Wipe the newly-active photo in over the previous one
  useEffect(() => {
    const el = layerRefs.current[active];
    if (!el || active === prev) return;
    gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.out' });
    gsap.fromTo(el.querySelector('.svc-img'), { scale: 1.2 }, { scale: 1, duration: 1.4, ease: 'expo.out' });
  }, [active, prev]);

  // Line-mask reveal of the huge names
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const mm = gsap.matchMedia();
      mm.add({ desktop: mq.desktop, mobile: mq.mobile, reduce: mq.reduce }, (ctx) => {
        const { reduce } = ctx.conditions as { desktop: boolean; mobile: boolean; reduce: boolean };
        if (reduce) return;

        gsap.from(section.querySelectorAll('.svc-name-inner'), {
          yPercent: 115,
          duration: 1.1,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: section.querySelector('.svc-list'), start: 'top 78%', once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      data-theme="light"
      className="relative fluid-pad-x fluid-pad-y"
      style={{ backgroundColor: 'var(--color-cream)', color: 'var(--color-ink)' }}
    >
      <header className="mb-10 md:mb-16">
        <p className="mb-4 text-xs uppercase tracking-[0.3em]" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-rose)' }}>
          04 — The Menu
        </p>
        <h2
          className="leading-[0.88]"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3.4rem, 11vw, 11rem)', letterSpacing: '-0.04em' }}
        >
          What we <span className="italic text-[var(--color-rose)]">do</span>
        </h2>
      </header>

      <div className="grid gap-10 md:grid-cols-[1.25fr_1fr] md:gap-[5vw]">
        {/* ── List ── */}
        <div className="svc-list">
          {services.map((service, i) => {
            const isOpen = open === i;
            const isActive = active === i;
            return (
              <div key={service.id} className="border-t" style={{ borderColor: 'rgba(26,17,24,0.15)' }}>
                <button
                  type="button"
                  className="group flex w-full items-baseline justify-between gap-4 py-4 text-left md:py-6"
                  aria-expanded={isOpen}
                  aria-controls={`svc-panel-${service.id}`}
                  onMouseEnter={() => {
                    select(i);
                    setOpen(i);
                  }}
                  onFocus={() => {
                    select(i);
                    setOpen(i);
                  }}
                  onClick={() => {
                    select(i);
                    setOpen(isOpen ? null : i);
                  }}
                >
                  <span className="flex items-baseline gap-4 md:gap-6">
                    <span className="w-6 text-xs tabular-nums opacity-50" style={{ fontFamily: 'var(--font-body)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="block overflow-hidden py-[0.06em]">
                      <span
                        className={`svc-name-inner block leading-[1] tracking-tight transition-colors duration-500 ${
                          isActive ? 'text-[var(--color-coral)]' : 'text-[var(--color-ink)]'
                        } ${isActive ? 'italic' : ''}`}
                        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.9rem, 4.6vw, 5rem)' }}
                      >
                        {service.name}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 text-xs opacity-60 md:text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                    {service.price}
                  </span>
                </button>

                {/* Panel: description, price, booking link (+ photo on mobile) */}
                <div
                  id={`svc-panel-${service.id}`}
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-6 md:pl-12">
                      <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl md:hidden">
                        <Image
                          src={service.image}
                          alt={service.name}
                          fill
                          sizes="(max-width: 767px) calc(100vw - 2.5rem), 0px"
                          className="object-cover"
                          style={{ objectPosition: service.focus ?? '50% 50%' }}
                        />
                      </div>
                      <p className="max-w-md text-sm leading-relaxed text-[var(--color-ink-soft)]" style={{ fontFamily: 'var(--font-body)' }}>
                        {service.description}
                      </p>
                      <a
                        href={waLink(contact.whatsapp, `Hi ${brand.name}, I'd like to book ${service.name}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block border-b border-[var(--color-coral)] pb-0.5 text-xs uppercase tracking-[0.2em] text-[var(--color-coral)] transition-opacity hover:opacity-70"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        Book this →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="border-t" style={{ borderColor: 'rgba(26,17,24,0.15)' }} />
        </div>

        {/* ── Sticky image stage (desktop) ── */}
        <div className="relative hidden md:block">
          <div className="sticky top-[12vh] h-[74vh]">
            <div className="relative h-full w-full overflow-hidden" style={{ clipPath: 'inset(0 round 999px 999px 0 0)' }}>
              {services.map((service, i) => (
                <div
                  key={service.id}
                  ref={(el) => {
                    layerRefs.current[i] = el;
                  }}
                  className="absolute inset-0"
                  style={{
                    zIndex: i === active ? 3 : i === prev ? 2 : 1,
                    opacity: i === active || i === prev ? 1 : 0,
                  }}
                  aria-hidden={i !== active}
                >
                  <div className="svc-img absolute inset-0">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      sizes="(min-width: 768px) 40vw, 0px"
                      className="object-cover"
                      style={{ objectPosition: service.focus ?? '50% 50%' }}
                    />
                  </div>
                </div>
              ))}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-8 pb-10 text-center"
                style={{ background: 'linear-gradient(to top, rgba(26,17,24,0.65), rgba(26,17,24,0))', color: 'var(--color-bone)' }}
              >
                <p className="italic" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 2.2vw, 2.4rem)' }}>
                  {services[active].name}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] opacity-80" style={{ fontFamily: 'var(--font-body)' }}>
                  {services[active].price}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
