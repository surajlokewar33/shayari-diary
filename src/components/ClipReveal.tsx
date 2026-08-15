'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface ClipRevealProps {
  children: ReactNode;
  triggered: boolean;
  color?: 'rose' | 'gold' | 'amber';
  className?: string;
}

const colorMap = {
  rose: 'rgba(194, 74, 96, 0.25)',
  gold: 'rgba(212, 175, 55, 0.25)',
  amber: 'rgba(232, 197, 104, 0.25)',
};

export default function ClipReveal({
  children,
  triggered,
  color = 'rose',
  className = '',
}: ClipRevealProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-full ${className}`}>
      {children}

      <AnimatePresence>
        {triggered && !prefersReduced && (
          <motion.div
            key="clip-ripple"
            className="absolute inset-0 pointer-events-none rounded-full z-10"
            style={{ backgroundColor: colorMap[color] }}
            initial={{
              clipPath: 'circle(0% at 50% 50%)',
              opacity: 1,
            }}
            animate={{
              clipPath: 'circle(150% at 50% 50%)',
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
