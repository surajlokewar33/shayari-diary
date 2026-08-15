'use client';

import { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const DEVANAGARI_CHARS = [
  'क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ',
  'ड', 'ढ', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब',
  'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह',
  'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ',
];

// Milliseconds each scrambling glyph stays visible before changing
const GLYPH_SWAP_INTERVAL = 70;

interface TextScrambleProps {
  text: string;
  duration?: number;
  className?: string;
}

export default function TextScramble({
  text,
  duration = 1400,
  className = '',
}: TextScrambleProps) {
  const prefersReduced = useReducedMotion();
  const [displayText, setDisplayText] = useState(text);
  const animRef = useRef<number | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If reduced motion is preferred or text is empty, show full text immediately
    if (prefersReduced || !text) {
      setDisplayText(text);
      return;
    }

    const startTime = performance.now();
    const length = text.length;
    let isCompleted = false;

    // Safety timeout: force-lock final text after duration + 400ms
    safetyTimeoutRef.current = setTimeout(() => {
      if (!isCompleted) {
        isCompleted = true;
        if (animRef.current) cancelAnimationFrame(animRef.current);
        setDisplayText(text);
      }
    }, duration + 400);

    const frame = (currentTime: number) => {
      try {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        const revealedCount = Math.floor(progress * length);

        if (progress >= 1) {
          isCompleted = true;
          setDisplayText(text);
          return;
        }

        let scrambled = '';
        for (let i = 0; i < length; i++) {
          const char = text[i];
          // Preserve whitespace, line breaks, and punctuation
          if (
            char === ' ' ||
            char === '\n' ||
            char === '—' ||
            char === '–' ||
            char === '…' ||
            char === '.' ||
            char === ',' ||
            char === '!' ||
            char === '?' ||
            char === '।' ||
            char === '़'
          ) {
            scrambled += char;
          } else if (i < revealedCount) {
            // Already settled permanently
            scrambled += char;
          } else if (i < revealedCount + 4) {
            // Active scramble window: throttled glyph swap (every 70ms)
            const glyphSeed = Math.floor((currentTime + i * 43) / GLYPH_SWAP_INTERVAL);
            const glyphIndex = Math.abs((glyphSeed * 9301 + 49297) % 233280) % DEVANAGARI_CHARS.length;
            scrambled += DEVANAGARI_CHARS[glyphIndex];
          } else {
            // Not yet revealed
            scrambled += ' ';
          }
        }

        setDisplayText(scrambled);
        animRef.current = requestAnimationFrame(frame);
      } catch (err) {
        console.error('TextScramble frame error:', err);
        setDisplayText(text);
      }
    };

    animRef.current = requestAnimationFrame(frame);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, [text, duration, prefersReduced]);

  return <span className={className}>{displayText}</span>;
}
