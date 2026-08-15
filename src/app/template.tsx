'use client';

import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '@/lib/motion';

/**
 * Route transition wrapper.
 * template.tsx re-mounts on every navigation (unlike layout.tsx),
 * so this gives us an enter-only fade + slide on each route change.
 *
 * Header & Footer live in layout.tsx and are NOT affected —
 * only the page content inside <main> re-mounts.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}
