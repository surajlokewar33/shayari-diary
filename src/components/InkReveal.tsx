'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ease } from '@/lib/motion';

interface InkRevealProps {
  text: string;
  className?: string;
  lineClassName?: string;
  isUrdu?: boolean;
}

export default function InkReveal({
  text,
  className = '',
  lineClassName = '',
  isUrdu = false,
}: InkRevealProps) {
  const prefersReduced = useReducedMotion();
  const lines = text.split('\n');

  if (prefersReduced) {
    return <div className={className}>{text}</div>;
  }

  return (
    <div className={className}>
      {lines.map((line, idx) => {
        // If it's an empty line, preserve vertical rhythm
        if (!line.trim()) {
          return <div key={idx} className="h-6" />;
        }

        return (
          <motion.div
            key={idx}
            className={`overflow-hidden will-change-transform ${lineClassName}`}
            initial={{
              clipPath: isUrdu ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
              opacity: 0.2,
            }}
            animate={{
              clipPath: 'inset(0 0 0 0)',
              opacity: 1,
            }}
            transition={{
              duration: 0.55,
              ease: [...ease],
              delay: idx * 0.14,
            }}
          >
            {line}
          </motion.div>
        );
      })}
    </div>
  );
}
