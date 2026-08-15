'use client';

import { useRef, useState, MouseEvent, ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  maxShift?: number;
}

export default function MagneticButton({
  children,
  className = '',
  strength = 0.25,
  maxShift = 6,
}: MagneticButtonProps) {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    const clampedX = Math.max(-maxShift, Math.min(maxShift, deltaX));
    const clampedY = Math.max(-maxShift, Math.min(maxShift, deltaY));

    setPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseEnter = () => {
    if (prefersReduced) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (prefersReduced) return;
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
    >
      <div
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: isHovered
            ? 'transform 0.1s ease-out'
            : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}
