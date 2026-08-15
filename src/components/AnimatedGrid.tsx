'use client';

import { ReactNode, Children } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ease, staggeredDelay } from '@/lib/motion';

interface AnimatedGridProps {
  children: ReactNode;
  /** CSS classes for the grid container */
  className?: string;
  /** Number of items that get full stagger delay. Items beyond this
   *  use a compressed tail delay so large grids don't take forever. */
  staggerLimit?: number;
  /** Delay between each of the first `staggerLimit` items (seconds) */
  baseDelay?: number;
  /** Delay between items beyond the stagger limit (seconds) */
  tailDelay?: number;
  /** Framer Motion viewport config for whileInView trigger */
  viewportOnce?: boolean;
  viewportMargin?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [...ease],
    },
  }),
};

const reducedVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
};

/**
 * Wraps children in a staggered whileInView animation.
 * Each child fades up on scroll into view, with configurable stagger capping.
 *
 * Usage:
 *   <AnimatedGrid className="grid grid-cols-3 gap-6" staggerLimit={8}>
 *     {poems.map(p => <PoemCard key={p._id} poem={p} />)}
 *   </AnimatedGrid>
 */
export default function AnimatedGrid({
  children,
  className = '',
  staggerLimit = 8,
  baseDelay = 0.06,
  tailDelay = 0.02,
  viewportOnce = true,
  viewportMargin = '-40px',
}: AnimatedGridProps) {
  const prefersReduced = useReducedMotion();
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, i) => (
        <motion.div
          key={i}
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: viewportOnce, margin: viewportMargin }}
          variants={prefersReduced ? reducedVariants : itemVariants}
          transition={{
            duration: 0.35,
            ease: [...ease],
            delay: prefersReduced ? 0 : staggeredDelay(i, staggerLimit, baseDelay, tailDelay),
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
