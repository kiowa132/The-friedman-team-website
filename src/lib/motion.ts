// Shared motion vocabulary for the whole site.
//
// The goal is ONE consistent physical "feel" everywhere instead of every
// component picking its own easing/duration. That consistency is most of
// what makes motion read as premium instead of janky.
//
// Everything here uses transform/opacity only (GPU-accelerated, never
// triggers layout/reflow), so none of it affects paint performance or
// Core Web Vitals when used as intended.

// A slightly decelerated custom ease - starts a touch quicker than
// ease-out, settles very softly. Reads as "considered", not bouncy.
export const EASE_PREMIUM: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const DURATION = {
  fast: 0.2,
  base: 0.35,
  slow: 0.6,
} as const;

// Fade + rise, used for section/card reveals as they enter the viewport.
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_PREMIUM },
  },
};

// Wrap a group of fadeUp children in this to stagger them.
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

// Simple opacity-only fade, for page transitions and anything where a
// vertical shift would be distracting (e.g. content that already scrolls).
export const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.base, ease: EASE_PREMIUM } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE_PREMIUM } },
};

// Subtle lift for primary CTA buttons/cards - not a bouncy spring, just a
// small, fast scale so it feels responsive rather than decorative.
export const liftHover = {
  whileHover: { scale: 1.02, y: -2 },
  whileTap: { scale: 0.98 },
  transition: { duration: DURATION.fast, ease: EASE_PREMIUM },
};

// Viewport settings shared by every scroll-reveal so a section never
// re-triggers its animation while scrolling past it repeatedly.
export const revealViewport = { once: true, margin: '-80px' as const };
