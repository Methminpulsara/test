'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { contact, booking, bookingImage } from '@/content/site';
import MagneticButton from '../ui/MagneticButton';
import { waLink, telLink } from '@/lib/utils';
import { mq } from '@/config/motion';

gsap.registerPlugin(ScrollTrigger);

/**
 * THE INVITATION — theme shifts from bone to mulberry as the section enters,
 * the headline reveals through line masks, and The Thread resolves into the
 * outline of the Book button (stroke draws with scroll).
 */
export default function LocationBooking() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      mm.add({ desktop: mq.desktop, mobile: mq.mobile, reduce: mq.reduce }, (ctx) => {
        const { reduce } = ctx.conditions as { desktop: boolean; mobile: boolean; reduce: boolean };
        if (reduce) return;

        // Colours are hex on purpose: GSAP can't tween CSS var() values.
        gsap.fromTo(
          section,
          { backgroundColor: '#F4EDE6' },
          {
            backgroundColor: '#3D1A38',
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top 95%', end: 'top 25%', scrub: true },
          }
        );

        gsap.from(q('.booking-line-inner'), {
          yPercent: 115,
          duration: 1.2,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: { trigger: q('.booking-headline')[0], start: 'top 85%', once: true },
        });

        gsap.to(q('.book-outline'), {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: q('.book-wrap')[0], start: 'top 95%', end: 'top 55%', scrub: true },
        });

        gsap.fromTo(
          q('.booking-img'),
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: q('.booking-arch')[0], start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [] }
  );

  const words = booking.headline.split(' ');
  const mid = Math.ceil(words.length / 2);
  const lines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  const linkCls = 'link-draw opacity-80 transition-opacity hover:opacity-100';

  return (
    <section
      ref={sectionRef}
      id="booking"
      data-theme="dark"
      className="relative overflow-hidden fluid-pad-x"
      style={{
        backgroundColor: 'var(--color-mulberry)',
        color: 'var(--color-bone)',
        paddingTop: 'clamp(7rem, 15vw, 15rem)',
        paddingBottom: 'clamp(4rem, 8vw, 8rem)',
      }}
    >
      <p className="mb-8 text-xs uppercase tracking-[0.3em] opacity-70" style={{ fontFamily: 'var(--font-body)' }}>
        06 — The Invitation
      </p>

      <div className="grid gap-14 md:grid-cols-12 md:gap-8">
        {/* Headline + CTAs */}
        <div className="md:col-span-7">
          <h2
            className="booking-headline mb-8 leading-[0.88]"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3.6rem, 11vw, 12rem)', letterSpacing: '-0.04em' }}
          >
            {lines.map((l, i) => (
              <span key={i} className="block overflow-hidden pb-[0.08em]">
                <span className={`booking-line-inner block ${i === 0 ? 'italic text-[var(--color-rose-light)]' : ''}`}>{l}</span>
              </span>
            ))}
          </h2>
          <p className="mb-10 max-w-md text-sm opacity-70 md:text-base" style={{ fontFamily: 'var(--font-body)' }}>
            {booking.subline}
          </p>

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="book-wrap relative inline-block">
              <svg
                className="pointer-events-none absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] overflow-visible"
                viewBox="0 0 300 80"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  className="book-outline"
                  x="1"
                  y="1"
                  width="298"
                  height="78"
                  rx="39"
                  stroke="var(--color-coral)"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset="1"
                />
              </svg>
              <MagneticButton
                as="a"
                href={waLink(contact.whatsapp, booking.whatsappText)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full px-10 py-5 text-sm uppercase tracking-[0.2em]"
                style={{ fontFamily: 'var(--font-body)', backgroundColor: 'var(--color-coral)', color: 'var(--color-cream)' }}
              >
                Book via WhatsApp
              </MagneticButton>
            </div>

            <MagneticButton
              as="a"
              href={telLink(contact.phone)}
              className="inline-block rounded-full border px-10 py-5 text-sm uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-[var(--color-bone)] hover:text-[var(--color-ink)]"
              style={{ fontFamily: 'var(--font-body)', borderColor: 'var(--color-bone)' }}
            >
              Call us
            </MagneticButton>
          </div>
        </div>

        {/* Arch photo + practical details */}
        <div className="md:col-span-5">
          <div className="booking-arch relative mx-auto mb-8 aspect-[4/5] w-full max-w-sm overflow-hidden md:ml-auto md:mr-0" style={{ clipPath: 'inset(0 round 999px 999px 0 0)' }}>
            <div className="booking-img absolute -inset-y-[10%] inset-x-0">
              <Image src={bookingImage} alt="The salon floor with round mirrors" fill sizes="(max-width: 768px) 90vw, 30vw" className="object-cover" />
            </div>
          </div>

          <div className="grid max-w-sm gap-6 text-sm sm:grid-cols-2 md:ml-auto md:mr-0" style={{ fontFamily: 'var(--font-body)' }}>
            <div>
              <h3 className="mb-2 text-xs uppercase tracking-[0.2em] opacity-50">Visit</h3>
              <address className="not-italic leading-relaxed opacity-80">{contact.address}</address>
              <a href={contact.mapLink} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block underline underline-offset-4 opacity-80 hover:text-[var(--color-coral)] hover:opacity-100">
                Get directions →
              </a>
            </div>
            <div>
              <h3 className="mb-2 text-xs uppercase tracking-[0.2em] opacity-50">Hours</h3>
              <p className="whitespace-pre-line leading-relaxed opacity-80">{contact.hours}</p>
            </div>
            <div className="sm:col-span-2">
              <h3 className="mb-2 text-xs uppercase tracking-[0.2em] opacity-50">Connect</h3>
              <ul className="flex flex-wrap gap-x-5 gap-y-1">
                <li>
                  <a href={telLink(contact.phone)} className={linkCls}>{contact.phone}</a>
                </li>
                <li>
                  <a href={waLink(contact.whatsapp, booking.whatsappText)} target="_blank" rel="noopener noreferrer" className={linkCls}>WhatsApp</a>
                </li>
                <li>
                  <a href={`mailto:${contact.email}`} className={linkCls}>{contact.email}</a>
                </li>
                <li>
                  <a href={contact.social.instagram} target="_blank" rel="noopener noreferrer" className={linkCls}>Instagram</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
