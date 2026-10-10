'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { navigation, contact } from '@/content/site';
import AccentSwitcher from './AccentSwitcher';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onChapterSelect: (id: string) => void;
  /** Chapter shortcuts only make sense on the home page */
  showChapters: boolean;
}

export default function MenuOverlay({ isOpen, onClose, onChapterSelect, showChapters }: MenuOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(0);

  // Open / close choreography
  useGSAP(
    () => {
      const overlay = overlayRef.current;
      const links = linksRef.current;
      if (!overlay || !links) return;
      const items = links.querySelectorAll('.menu-link-inner');
      const extras = links.querySelectorAll('.menu-extra');

      if (isOpen) {
        gsap.set(overlay, { display: 'flex' });
        gsap.fromTo(
          overlay,
          { clipPath: 'circle(0% at calc(100% - 3rem) 2.5rem)' },
          { clipPath: 'circle(150% at calc(100% - 3rem) 2.5rem)', duration: 0.9, ease: 'expo.out' }
        );
        gsap.fromTo(items, { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out', delay: 0.25 });
        gsap.fromTo(extras, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: 'power3.out', delay: 0.6 });
      } else if (overlay.style.display === 'flex') {
        gsap.to(overlay, {
          clipPath: 'circle(0% at calc(100% - 3rem) 2.5rem)',
          duration: 0.6,
          ease: 'expo.inOut',
          onComplete: () => {
            gsap.set(overlay, { display: 'none' });
          },
        });
      }
    },
    { dependencies: [isOpen] }
  );

  // Cursor-following preview image
  useEffect(() => {
    if (!isOpen) return;
    const el = previewRef.current;
    if (!el || window.matchMedia('(pointer: coarse)').matches) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    const move = (e: MouseEvent) => {
      xTo(e.clientX + 40);
      yTo(e.clientY - 140);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [isOpen]);

  // Esc closes, Tab is trapped inside the overlay
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const overlay = overlayRef.current;
      if (!overlay) return;
      const focusables = overlay.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement;
      if (e.shiftKey && activeEl === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      } else if (!overlay.contains(activeEl)) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    const t = setTimeout(() => firstFocusRef.current?.focus(), 400);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  return (
    <div
      ref={overlayRef}
      id="menu-overlay"
      className="fixed inset-0 z-[99] hidden flex-col justify-center items-start overflow-y-auto py-24"
      style={{ backgroundColor: 'var(--color-mulberry)', color: 'var(--color-bone)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      aria-hidden={!isOpen}
    >
      {/* Hover preview (desktop only) */}
      <div
        ref={previewRef}
        className="pointer-events-none fixed left-0 top-0 z-[1] hidden aspect-[3/4] w-[16vw] max-w-[260px] md:block"
        style={{ clipPath: 'inset(0 round 999px 999px 0 0)' }}
        aria-hidden="true"
      >
        {navigation.pages.map((p, i) => (
          <Image
            key={p.href}
            src={p.preview}
            alt=""
            fill
            sizes="260px"
            className="object-cover transition-opacity duration-500"
            style={{ opacity: hovered === i ? 1 : 0 }}
          />
        ))}
      </div>

      <div ref={linksRef} className="fluid-pad-x relative z-[2] w-full">
        <nav aria-label="Pages" className="mb-10 md:mb-14">
          {navigation.pages.map((page, i) => (
            <div key={page.href} className="overflow-hidden py-[0.02em]">
              <Link
                ref={i === 0 ? firstFocusRef : undefined}
                href={page.href}
                onClick={onClose}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                className="group block leading-[1.02] tracking-tight transition-colors duration-300 hover:text-[var(--color-coral)] focus-visible:text-[var(--color-coral)]"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 9vw, 8.5rem)' }}
              >
                <span className="menu-link-inner block">
                  <span className="mr-4 align-top text-[0.18em] tracking-[0.2em] opacity-50" style={{ fontFamily: 'var(--font-body)' }}>
                    0{i + 1}
                  </span>
                  {page.label}
                </span>
              </Link>
            </div>
          ))}
        </nav>

        {showChapters && (
          <div className="mb-10 flex flex-wrap gap-x-6 gap-y-3">
            {navigation.chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => onChapterSelect(ch.id)}
                className="menu-extra text-xs uppercase tracking-[0.2em] opacity-70 transition-all duration-300 hover:text-[var(--color-coral)] hover:opacity-100"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {ch.number} {ch.label}
              </button>
            ))}
          </div>
        )}

        <div className="menu-extra mb-8">
          <AccentSwitcher />
        </div>

        <div className="menu-extra text-sm opacity-70" style={{ fontFamily: 'var(--font-body)' }}>
          <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="transition-colors hover:text-[var(--color-coral)]">
            {contact.phone}
          </a>
          <span className="mx-3">·</span>
          <a href={contact.social.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[var(--color-coral)]">
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
