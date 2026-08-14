'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AmbientCanvas from './AmbientCanvas';

const LINES = [
  'ये दिन भी कभी गुज़रेगा, मेरे लिखे शेर रहेंगे...',
  'मै शायद ग़मो के बाज़ार में खो गया.....',
  'थके पाँव किस दुकान पे आ गया ......',
  'मै दर्द की आखिरी सीढ़ी चढ़कर .....',
  'शायरी के पहले मुकाम पे आ गया .....',
  'हर लफ़्ज़ में एक दास्ताँ, हर शेर में एक राज़ है...',
];

export default function HeroBanner() {
  const [lineIndex, setLineIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = LINES[lineIndex];
    const speed = deleting ? 30 : 50;

    const timeout = setTimeout(() => {
      if (!deleting) {
        if (text.length < current.length) {
          setText(current.slice(0, text.length + 1));
        } else {
          setTimeout(() => setDeleting(true), 1800);
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
    <section className="relative w-full pt-3 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
      {/* Framed Atmospheric Hero Container */}
      <div className="relative rounded-3xl overflow-hidden border border-gold/30 shadow-journal bg-ink group">
        {/* Background Atmosphere */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105 group-hover:scale-100 opacity-60"
          style={{
            backgroundImage: "url('/hero_banner.jpg')",
          }}
        />

        {/* Ambient Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-maroon/80 to-ink/75" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-ink/40 to-ink" />

        {/* Ambient Canvas (Floating Petals) */}
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <AmbientCanvas mode="petals" />
        </div>

        {/* Ornate Corner Highlights */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold/40 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gold/40 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold/40 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold/40 rounded-br-lg pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 px-6 py-14 sm:py-20 md:px-12 md:py-24 text-center max-w-3xl mx-auto flex flex-col items-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass border border-gold/35 text-amber text-xs tracking-wider uppercase font-ui mb-5 shadow-sm">
            <span className="text-gold">✦</span>
            <span>सुरज लोकेवार की डायरी</span>
            <span className="text-gold">✦</span>
          </div>

          {/* Bilingual Masthead Lockup: suru_33 / सूरु शाइर */}
          <h1 className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-parchment drop-shadow-md mb-2">
            <span className="font-ui text-amber">suru_33</span>
            <span className="text-muted/70 text-3xl sm:text-4xl md:text-5xl font-light">/</span>
            <span className="font-devanagari text-parchment">सूरु शाइर</span>
          </h1>

          {/* Subtitle */}
          <p className="font-ui text-xs sm:text-sm md:text-base tracking-[0.2em] text-cream/90 uppercase font-medium mb-6">
            A Digital Shayari Diary <span className="text-muted/60">·</span> Verses of Love, Longing & Life
          </p>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-3 w-40 mb-6 opacity-75">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-gold" />
            <span className="text-gold text-xs">❦</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-gold" />
          </div>

          {/* Typewriter Couplet Box */}
          <div className="min-h-[64px] sm:min-h-[58px] flex items-center justify-center mb-8 px-4 py-3 rounded-2xl glass border border-gold/20 max-w-xl w-full shadow-inner">
            <p className="font-devanagari text-base sm:text-lg md:text-xl text-cream font-medium leading-relaxed">
              &ldquo;{text}&rdquo;
              <span className="inline-block w-[2px] h-5 bg-amber ml-1.5 animate-shimmer align-middle" />
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 text-xs sm:text-sm font-ui">
            <a
              href="#latest-poems"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold/80 via-gold to-amber text-ink font-semibold tracking-wide shadow-glow hover:brightness-110 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              डायरी पढ़ें &darr;
            </a>

            <a
              href="#couplet-of-the-day"
              className="px-5 py-2.5 rounded-full glass border border-gold/40 text-cream hover:text-amber hover:border-gold transition-all"
            >
              शेर-ए-वक़्त ✨
            </a>

            <Link
              href="/category"
              className="px-5 py-2.5 rounded-full glass border border-gold/25 text-muted hover:text-parchment hover:border-gold/40 transition-all"
            >
              श्रेणियाँ &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
