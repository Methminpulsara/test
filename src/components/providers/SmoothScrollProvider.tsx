'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
// Mobile browser chrome can change viewport height while the user scrolls. Keep existing pin
// measurements stable during those small changes; orientation/pageshow are refreshed below.
ScrollTrigger.config({ ignoreMobileResize: true });

interface SmoothScrollContextType {
  lenis: Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({ lenis: null });

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const instance = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !prefersReducedMotion,
      // Touch scrolling stays native; Lenis smooths wheel/trackpad input only.
      syncTouch: false,
    });

    lenisRef.current = instance;
    // Lenis needs `window`, so it can only be created after mount; children read it from context.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);

    // Sync Lenis scroll with GSAP ScrollTrigger
    instance.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP ticker (single animation loop)
    const tick = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Re-measure every pinned scene once fonts / images / rotation have changed the
    // page height. Without this, phones can end up with triggers in the wrong place.
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    const refresh = (delay = 120) => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), delay);
    };
    const onLoad = () => refresh(200);
    const onOrientation = () => refresh(400);
    const onPageShow = () => refresh(180);
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') refresh(180);
    };
    if (document.readyState === 'complete') refresh(200);
    else window.addEventListener('load', onLoad);
    window.addEventListener('orientationchange', onOrientation);
    window.addEventListener('pageshow', onPageShow);
    document.addEventListener('visibilitychange', onVisibilityChange);
    document.fonts?.ready.then(() => refresh(100)).catch(() => {});
    const lateRefresh = setTimeout(() => refresh(0), 1500); // images decoded by now

    return () => {
      clearTimeout(refreshTimer);
      clearTimeout(lateRefresh);
      window.removeEventListener('load', onLoad);
      window.removeEventListener('orientationchange', onOrientation);
      window.removeEventListener('pageshow', onPageShow);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      gsap.ticker.remove(tick);
      instance.off('scroll', ScrollTrigger.update);
      instance.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
