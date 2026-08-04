'use client';

import { useEffect, useState } from 'react';
import AmbientCanvas from './AmbientCanvas';

const LINES = [
  'मै शायद ग़मो के बाजार में खो गया.....',
  'थके पांव किस दुकान पे आगया ......',
  'मै दर्द की आखिरी सीडी चढ़कर  .....',
  'शायरी के पहले मुकाम पे आगया .....',
];

export default function TypewriterHero() {
  const [lineIndex, setLineIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = LINES[lineIndex];
    const speed = deleting ? 35 : 55;

    const timeout = setTimeout(() => {
      if (!deleting) {
        if (text.length < current.length) {
          setText(current.slice(0, text.length + 1));
        } else {
          setTimeout(() => setDeleting(true), 1400);
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
    <section className="relative overflow-hidden">
      <AmbientCanvas mode="petals" />
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-35 md:py-36 text-center">
        <p className="font-mono text-xs tracking-[0.5em] uppercase text-accent mb-6"> सूरु शाइर</p>
        <h1 className="font-display text-6xl md:text-6xl leading-[3] text-parchment">
          ये दिन भी कभी गुज़रेगा ,<br className="hidden md:block" />
<span className="block mt-8">मेरे लिखे शेर रहेंगे |</span>
        </h1>
        <div className="mt-8 h-10">
          <p className="font-display text-lg md:text-2xl text-accent-bright">
            {text}
            <span className="inline-block w-[2px] h-6 bg-accent-bright ml-1 animate-shimmer align-middle" />
          </p>
        </div>
      </div>
    </section>
  );
}