'use client';

import { ReactNode, useState, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

interface PageTurnLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function PageTurnLink({
  href,
  children,
  className = '',
}: PageTurnLinkProps) {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Standard link behavior for new tab / special keys
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || prefersReduced) {
      return;
    }

    e.preventDefault();
    if (isNavigating) return;

    setIsNavigating(true);
    setTimeout(() => {
      router.push(href);
    }, 220);
  };

  return (
    <motion.a
      href={href}
      onClick={handleClick}
      className={`block perspective-[1000px] ${className}`}
      animate={
        isNavigating && !prefersReduced
          ? {
              rotateY: -15,
              scale: 0.98,
              opacity: 0.3,
              filter: 'blur(2px)',
            }
          : {
              rotateY: 0,
              scale: 1,
              opacity: 1,
              filter: 'blur(0px)',
            }
      }
      transition={{
        duration: 0.22,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ transformStyle: 'preserve-3d', transformOrigin: 'left center' }}
    >
      {children}
    </motion.a>
  );
}
