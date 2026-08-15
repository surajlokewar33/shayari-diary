'use client';

import { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const DEVANAGARI_CHARS = [
  'क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ',
  'ड', 'ढ', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब',
  'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह',
  'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ',
];

interface TextScrambleProps {
  text: string;
  duration?: number;
  className?: string;
}

export default function TextScramble({
  text,
  duration = 800,
  className = '',
}: TextScrambleProps) {
  const prefersReduced = useReducedMotion();
  const [displayText, setDisplayText] = useState(text);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReduced) {
      setDisplayText(text);
      return;
    }

    const startTime = performance.now();
    const length = text.length;

    const frame = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const revealedCount = Math.floor(progress * length);

      let scrambled = '';
      for (let i = 0; i < length; i++) {
        const char = text[i];
        if (char === ' ' || char === '\n' || char === '—' || char === '–' || char === '…' || char === '.' || char === ',' || char === '!') {
          scrambled += char;
        } else if (i < revealedCount) {
          scrambled += char;
        } else if (i < revealedCount + 3) {
          // Shuffling characters for the leading edge
          const randomChar = DEVANAGARI_CHARS[Math.floor(Math.random() * DEVANAGARI_CHARS.length)];
          scrambled += randomChar;
        } else {
          scrambled += ' ';
        }
      }

      setDisplayText(scrambled);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(frame);
      } else {
        setDisplayText(text);
      }
    };

    animRef.current = requestAnimationFrame(frame);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [text, duration, prefersReduced]);

  return <span className={className}>{displayText}</span>;
}
