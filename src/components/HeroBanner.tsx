'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AmbientCanvas from './AmbientCanvas';
import { motion, useReducedMotion } from 'framer-motion';
import { heroContainerVariants, heroItemVariants } from '@/lib/motion';
import MagneticButton from './MagneticButton';
import TextScramble from './TextScramble';

const LINES = [
  'ये दिन भी कभी गुज़रेगा, मेरे लिखे शेर रहेंगे...',
  'मै शायद ग़मो के बाज़ार में खो गया.....',
  'थके पाँव किस दुकान पे आ गया ......',
  'मै दर्द की आखिरी सीढ़ी चढ़कर .....',
  'शायरी के पहले मुकाम पे आ गया .....',
  'हर लफ़्ज़ में एक दास्ताँ, हर शेर में एक राज़ है...',
];

export default function HeroBanner() {
  const prefersReduced = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = LINES[lineIndex];
    const speed = deleting ? 25 : 45;

    const timeout = setTimeout(() => {
      if (!deleting) {
        if (text.length < current.length) {
          setText(current.slice(0, text.length + 1));
        } else {
          setTimeout(() => setDeleting(true), 2000);
        }
      } else {
        if (text.length > 0) {
          setText(current.slice(0, text.length - 1));
        } else {
          setDeleting(false);
          setLineIndex((i) => (i + 1) % LINES.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, deleting, lineIndex]);

  return (
    <section className="relative w-full pt-4 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
      {/* Framed Atmospheric Hero Container */}
      <div className="relative rounded-3xl overflow-hidden border border-gold/35 shadow-card bg-ink group">
        {/* Illustrated Desk Artwork with Dark Scrim */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 group-hover:scale-100 opacity-50"
          style={{
            backgroundImage: "url('/hero_banner.jpg')",
          }}
        />

        {/* Multi-layer High-Legibility Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-maroon/85 to-ink/80" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-ink/50 to-ink" />

        {/* Ambient Canvas (Floating Petals) */}
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <AmbientCanvas mode="petals" />
        </div>

        {/* Ornate Corner Accents */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gold/40 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gold/40 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gold/40 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gold/40 rounded-br-lg pointer-events-none" />

        {/* Hero Content */}
        <motion.div
          variants={prefersReduced ? undefined : heroContainerVariants}
          initial={prefersReduced ? undefined : 'hidden'}
          animate={prefersReduced ? undefined : 'visible'}
          className="relative z-10 px-6 py-14 sm:py-20 md:px-12 md:py-24 text-center max-w-3xl mx-auto flex flex-col items-center">
          {/* Top Pill Badge */}
          <motion.div variants={heroItemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/35 text-amber text-xs tracking-wider uppercase font-ui mb-5 shadow-sm">
            <span className="text-gold">✦</span>
            <span>मुरीद शाइर की डायरी</span>
            <span className="text-gold">✦</span>
          </motion.div>

          {/* Masthead: मुरीद शाइर */}
          <motion.h1 variants={heroItemVariants} className="flex flex-wrap items-center justify-center gap-3 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-parchment drop-shadow-md mb-3 font-devanagari">
            <span className="text-parchment">मुरीद</span>
            <span className="text-amber">शाइर</span>
          </motion.h1>

          {/* English Subtitle */}
          <motion.p variants={heroItemVariants} className="font-ui text-xs sm:text-sm md:text-base tracking-[0.2em] text-cream/90 uppercase font-medium mb-6">
            A Digital Shayari Diary <span className="text-muted/50">·</span> Verses of Love, Longing & Life
          </motion.p>

          {/* Decorative Divider */}
          <motion.div variants={heroItemVariants} className="flex items-center justify-center gap-3 w-44 mb-6 opacity-80">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-gold" />
            <span className="text-gold text-xs">❦</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-gold" />
          </motion.div>

          {/* Typewriter / Scramble Couplet Box */}
          <motion.div variants={heroItemVariants} className="min-h-[64px] sm:min-h-[58px] flex items-center justify-center mb-8 px-5 py-3 rounded-2xl glass border border-gold/20 max-w-xl w-full shadow-inner">
            <p className="font-devanagari text-base sm:text-lg md:text-xl text-cream font-medium leading-relaxed">
              &ldquo;<TextScramble text={text || LINES[0]} />&rdquo;
              <span className="inline-block w-[2px] h-5 bg-amber ml-1.5 animate-shimmer align-middle" />
            </p>
          </motion.div>

          {/* Unified Action Buttons */}
          <motion.div variants={heroItemVariants} className="flex flex-wrap items-center justify-center gap-3.5">
            <MagneticButton strength={0.3} maxShift={6}>
              <a
                href="#latest-poems"
                className="btn-primary"
              >
                डायरी पढ़ें &darr;
              </a>
            </MagneticButton>

            <a
              href="#couplet-of-the-day"
              className="btn-secondary"
            >
              शेर-ए-वक़्त ✨
            </a>

            <Link
              href="/category"
              className="btn-ghost"
            >
              श्रेणियाँ &rarr;
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
