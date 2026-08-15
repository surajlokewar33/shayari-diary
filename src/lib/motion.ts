/**
 * Shared Framer Motion presets for the entire app.
 * Single source of truth — import from here, don't copy-paste transitions.
 */

// Easing that matches the existing CSS cubic-bezier(0.16, 1, 0.3, 1)
export const ease = [0.16, 1, 0.3, 1] as const;

// ── Reusable transition objects ──────────────────────────────────────

export const transition = {
  /** Default — 250ms, matches existing CSS transitions */
  default: { duration: 0.25, ease },
  /** Slow — 400ms, for larger elements (poem body, hero) */
  slow: { duration: 0.4, ease },
  /** Spring — for bouncy micro-interactions (like button) */
  spring: { type: 'spring' as const, stiffness: 400, damping: 25 },
  /** Bounce — punchier spring for tap feedback */
  bounce: { type: 'spring' as const, stiffness: 500, damping: 15 },
};

// ── Page enter transition (template.tsx) ─────────────────────────────

export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

export const pageTransition = { duration: 0.25, ease };

// ── Fade-up for individual items ─────────────────────────────────────

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease },
  },
};

// ── Staggered fade-up with configurable cap ──────────────────────────
// Items 0..(limit-1) get `index * baseDelay`.
// Items beyond get grouped at a smaller tail delay.

export function staggeredDelay(
  index: number,
  staggerLimit = 8,
  baseDelay = 0.06,
  tailDelay = 0.02,
): number {
  if (index < staggerLimit) return index * baseDelay;
  return staggerLimit * baseDelay + (index - staggerLimit) * tailDelay;
}

export function staggeredItemVariants(
  staggerLimit = 8,
  baseDelay = 0.06,
  tailDelay = 0.02,
) {
  return {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease,
        delay: staggeredDelay(i, staggerLimit, baseDelay, tailDelay),
      },
    }),
  };
}

// ── Hero entrance variants ───────────────────────────────────────────

export const heroContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const heroItemVariants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease },
  },
};

// ── Couplet swap transition ──────────────────────────────────────────

export const sherVariants = {
  enter: { opacity: 0, y: 8 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const sherTransition = { duration: 0.25, ease };

// ── Like / Favorite bounce ───────────────────────────────────────────

export const likeBounceKeyframes = {
  scale: [1, 1.3, 0.95, 1],
};

export const likeBounceTransition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as const,
};
