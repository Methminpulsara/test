/**
 * Motion design tokens — one place for all animation constants.
 * Components import from here so motion language is consistent.
 */

export const easings = {
  /** Primary ease for most reveals and transitions */
  smooth: 'expo.out',
  /** For scroll-driven pinned timelines */
  scrub: 'none',
  /** Snappy interactive feedback (hover, tap) */
  snap: 'power4.out',
  /** Gentle entrance */
  gentle: 'power2.out',
  /** Symmetric ease for looping / reversible */
  inOut: 'power3.inOut',
} as const;

export const durations = {
  fast: 0.4,
  normal: 0.8,
  slow: 1.2,
  reveal: 1.0,
  pageTransition: 0.6,
  stagger: 0.08,
} as const;

export const parallaxSpeeds = {
  /** Slowest — background layer */
  bg: 0.2,
  /** Mid layer */
  mid: 0.5,
  /** Foreground — moves fastest relative to scroll */
  fg: 0.9,
  /** Subtle shift */
  subtle: 0.15,
} as const;

/**
 * Media queries for gsap.matchMedia().
 * IMPORTANT: when matchMedia gets an object of conditions, the callback only runs if
 * AT LEAST ONE of them matches. Always include both `desktop` and `mobile` so the
 * callback is guaranteed to run on every screen size (phones, tablets, laptops).
 */
export const mq = {
  desktop: '(min-width: 768px)',
  mobile: '(max-width: 767px)',
  reduce: '(prefers-reduced-motion: reduce)',
  /** A real mouse / trackpad (not a touch screen) */
  finePointer: '(hover: hover) and (pointer: fine)',
} as const;

export const breakpoints = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
} as const;
