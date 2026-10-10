'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { brand, navigation, contact, booking } from '@/content/site';
import MenuOverlay from './MenuOverlay';
import ChapterIndicator from './ChapterIndicator';
import MagneticButton from '../ui/MagneticButton';
import { useSmoothScroll } from '../providers/SmoothScrollProvider';
import { waLink } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeChapter, setActiveChapter] = useState('01');
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const lastScrollY = useRef(0);
  const wasOpen = useRef(false);
  const { lenis } = useSmoothScroll();

  // Hide on scroll down, return on scroll up
  useEffect(() => {
    if (!lenis) return;
    const handleScroll = () => {
      const y = lenis.scroll;
      setHidden(y > lastScrollY.current && y > 120);
      lastScrollY.current = y;
    };
    lenis.on('scroll', handleScroll);
    return () => lenis.off('scroll', handleScroll);
  }, [lenis]);

  // New route: close menu, jump to top, let ScrollTrigger re-measure
  useEffect(() => {
    // Route changes are an external event: reset the UI state for the new page on purpose.
    /* eslint-disable react-hooks/set-state-in-effect */
    setMenuOpen(false);
    setHidden(false);
    /* eslint-enable react-hooks/set-state-in-effect */
    lenis?.scrollTo(0, { immediate: true });
    const t = setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => clearTimeout(t);
  }, [pathname, lenis]);

  // Track the active chapter (home only). Triggers are created after the page's
  // own pinned sections exist, and killed again when the route changes.
  useEffect(() => {
    if (!isHome) return;
    const triggers: ScrollTrigger[] = [];
    const timer = setTimeout(() => {
      navigation.chapters.forEach((ch) => {
        const el = document.getElementById(ch.id);
        if (!el) return;
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => setActiveChapter(ch.number),
            onEnterBack: () => setActiveChapter(ch.number),
          })
        );
      });
    }, 150);
    return () => {
      clearTimeout(timer);
      triggers.forEach((t) => t.kill());
    };
  }, [pathname, isHome]);

  // Scroll lock + focus restore
  useEffect(() => {
    if (menuOpen) {
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.documentElement.style.overflow = '';
      if (wasOpen.current) menuButtonRef.current?.focus();
    }
    wasOpen.current = menuOpen;
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [menuOpen, lenis]);

  // Pinned sections live inside ScrollTrigger spacers, so jump to the trigger's
  // start position instead of the element's current rect.
  const scrollToChapter = (id: string) => {
    if (!lenis) return;
    const el = document.getElementById(id);
    if (!el) return;
    const st = ScrollTrigger.getAll().find((t) => t.pin === el);
    const y = st ? st.start : el.getBoundingClientRect().top + lenis.scroll;
    lenis.scrollTo(y, { duration: 1.6 });
  };

  const currentChapter = navigation.chapters.find((c) => c.number === activeChapter);

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-[100] flex items-center justify-between fluid-pad-x transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'
        }`}
        style={{ height: 'var(--nav-height)' }}
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="relative z-[101] text-xl tracking-tight text-[var(--color-bone)] mix-blend-difference"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {brand.name}
        </Link>

        <div className="relative z-[101] flex items-center gap-5 md:gap-7">
          {isHome && (
            <span
              className="hidden text-[10px] uppercase tracking-[0.25em] text-[var(--color-bone)] mix-blend-difference xl:block"
              style={{ fontFamily: 'var(--font-body)' }}
              aria-live="polite"
            >
              {currentChapter ? `${currentChapter.number} / 0${navigation.chapters.length} — ${currentChapter.label}` : ''}
            </span>
          )}

          <button
            ref={menuButtonRef}
            onClick={() => setMenuOpen((o) => !o)}
            className="text-sm uppercase tracking-[0.2em] text-[var(--color-bone)] mix-blend-difference transition-opacity hover:opacity-70"
            style={{ fontFamily: 'var(--font-body)' }}
            aria-expanded={menuOpen}
            aria-controls="menu-overlay"
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>

          <MagneticButton
            as="a"
            href={waLink(contact.whatsapp, booking.whatsappText)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-transform duration-300 hover:scale-[1.04] md:px-5 md:py-2.5 md:text-xs"
            style={{
              fontFamily: 'var(--font-body)',
              backgroundColor: 'var(--color-coral)',
              color: 'var(--color-cream)',
            }}
          >
            Book
          </MagneticButton>
        </div>
      </nav>

      {isHome && <ChapterIndicator active={activeChapter} onSelect={scrollToChapter} />}

      <MenuOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        showChapters={isHome}
        onChapterSelect={(id) => {
          setMenuOpen(false);
          // wait for the scroll lock to release before moving
          setTimeout(() => scrollToChapter(id), 120);
        }}
      />
    </>
  );
}
