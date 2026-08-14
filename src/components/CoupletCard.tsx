'use client';

import { useState } from 'react';

const CURATED_SHERS = [
  {
    sher: 'मै शायद ग़मो के बाज़ार में खो गया.....\nथके पाँव किस दुकान पे आ गया ......',
    author: 'सुरज लोकेवार',
    tag: 'दर्द और सफ़र',
  },
  {
    sher: 'मै दर्द की आखिरी सीढ़ी चढ़कर .....\nशायरी के पहले मुकाम पे आ गया .....',
    author: 'सुरज लोकेवार',
    tag: 'शायरी का सफ़र',
  },
  {
    sher: 'ये दिन भी कभी गुज़रेगा,\nमेरे लिखे शेर रहेंगे |',
    author: 'सूरु 33',
    tag: 'यादें',
  },
  {
    sher: 'लफ़्ज़ों में समेट रखी है हमने दास्ताँ अपनी,\nजो दिल ने महसूस किया, काग़ज़ ने बयां कर दिया।',
    author: 'सुरज लोकेवार',
    tag: 'एहसास',
  },
  {
    sher: 'कुछ ख्वाब अधूरे ही अच्छे होते हैं,\nकम से कम सोने की वजह तो बने रहते हैं।',
    author: 'सूरु शाइर',
    tag: 'ख्वाब',
  },
  {
    sher: 'रात की तन्हाई में जब क़लम उठाई हमने,\nहर एक ख़याल तेरा मिसरा बन गया।',
    author: 'सूरु 33',
    tag: 'तन्हाई',
  },
];

export default function CoupletCard({
  customShers,
}: {
  customShers?: { sher: string; author: string; tag?: string }[];
}) {
  const shers = customShers && customShers.length > 0 ? customShers : CURATED_SHERS;
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [fade, setFade] = useState(true);

  const current = shers[index];

  function nextSher() {
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % shers.length);
      setFade(true);
    }, 150);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(`${current.sher}\n\n— ${current.author} (suru_33)`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      id="couplet-of-the-day"
      className="relative glass-journal rounded-3xl p-6 sm:p-8 md:p-10 border border-gold/30 overflow-hidden my-6 sm:my-8 shadow-card"
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          {/* Header Tag */}
          <div className="flex items-center gap-2.5 mb-3">
            <span className="flex h-2 w-2 rounded-full bg-amber animate-pulse" />
            <span className="font-ui text-xs tracking-wider uppercase text-gold font-semibold">
              शेर-ए-वक़्त · Couplet of the Moment
            </span>
            {current.tag && (
              <span className="text-[11px] font-ui px-2.5 py-0.5 rounded-full border border-gold/20 text-muted">
                #{current.tag}
              </span>
            )}
          </div>

          {/* Sher Content with CSS Fade Transition */}
          <div
            className={`transition-opacity duration-200 ${
              fade ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <blockquote className="font-devanagari text-xl sm:text-2xl md:text-3xl text-parchment font-semibold leading-relaxed whitespace-pre-line my-3">
              &ldquo;{current.sher}&rdquo;
            </blockquote>

            <p className="font-ui text-xs sm:text-sm text-amber mt-2 flex items-center gap-1.5 font-medium">
              <span>— {current.author}</span>
              <span className="text-muted text-xs font-normal">(suru_33)</span>
            </p>
          </div>
        </div>

        {/* Action Buttons: Shuffle and Copy (min 44px touch targets) */}
        <div className="flex items-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gold/15">
          <button
            onClick={nextSher}
            className="btn-secondary text-xs font-ui min-h-[44px] px-4 gap-2"
            title="Next Couplet"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>नया शेर</span>
          </button>

          <button
            onClick={handleCopy}
            aria-live="polite"
            className={`text-xs font-ui min-h-[44px] px-4 transition-all ${
              copied
                ? 'btn-secondary border-gold text-amber bg-gold/20 shadow-sm'
                : 'btn-ghost'
            }`}
            title="Copy to Clipboard"
          >
            {copied ? '✓ कॉपी हुआ' : 'कॉपी करें'}
          </button>
        </div>
      </div>
    </div>
  );
}
