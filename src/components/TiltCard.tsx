'use client';

import { useRef, useState, MouseEvent, ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  id?: string;
  maxTilt?: number;
}

export default function TiltCard({
  children,
  className = '',
  id,
  maxTilt = 8,
}: TiltCardProps) {
  const prefersReduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>('perspective(700px) rotateX(0deg) rotateY(0deg)');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(
      `perspective(700px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`
    );
  };

  const handleMouseEnter = () => {
    if (prefersReduced) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (prefersReduced) return;
    setIsHovered(false);
    setTransform('perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  if (prefersReduced) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      id={id}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transform,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
