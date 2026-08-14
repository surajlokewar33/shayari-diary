'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PoemCard from '@/components/PoemCard';
import { Poem } from '@/lib/types';
import { getFavorites } from '@/lib/favorites';

function SkeletonCard() {
  return (
    <div className="glass-journal rounded-3xl p-6 sm:p-7 h-[280px] border border-gold/20 flex flex-col justify-between skeleton-shimmer">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-24 h-6 rounded-full bg-white/5" />
          <div className="w-16 h-4 rounded bg-white/5" />
        </div>
        <div className="w-3/4 h-7 rounded bg-white/5 mb-3" />
        <div className="w-full h-4 rounded bg-white/5 mb-2" />
        <div className="w-4/5 h-4 rounded bg-white/5" />
      </div>
      <div className="pt-4 border-t border-gold/10 flex justify-between">
        <div className="w-20 h-4 rounded bg-white/5" />
        <div className="w-10 h-4 rounded bg-white/5" />
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = getFavorites();
    if (ids.length === 0) {
      setLoading(false);
      return;
    }
    fetch(`/api/poems?ids=${ids.join(',')}`)
      .then((r) => r.json())
      .then((data) => setPoems(data.poems || []))
      .catch((err) => console.error('Failed to load favorites', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-12 md:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-amber text-xs font-ui uppercase tracking-widest mb-4 font-semibold">
          <span>★</span>
          <span>सहेजी गई रचनाएँ · Favorites</span>
          <span>★</span>
        </div>

        <h1 className="font-devanagari text-4xl sm:text-5xl font-bold text-parchment mb-4">
          आपकी पसंदीदा शायरियाँ
        </h1>

        <p className="font-devanagari text-base sm:text-lg text-cream leading-relaxed">
          वे पंक्तियाँ जो आपके दिल को छू गईं, इस डिवाइस पर हमेशा के लिए सुरक्षित हैं।
        </p>
      </div>

      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && poems.length === 0 && (
        <div className="glass-journal rounded-3xl p-10 sm:p-12 text-center border border-gold/25 max-w-md mx-auto shadow-card">
          <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-2xl mx-auto mb-4 text-amber shadow-sm">
            ★
          </div>
          <h2 className="font-devanagari text-xl font-bold text-parchment mb-2">
            कोई पसंदीदा रचना नहीं है
          </h2>
          <p className="text-sm font-ui text-cream/80 mb-6 leading-relaxed">
            डायरी पढ़ते समय किसी भी शायरी पर ★ दबाकर उसे अपनी इस व्यक्तिगत सूची में सहेजें।
          </p>
          <Link
            href="/"
            className="btn-primary text-xs"
          >
            शायरियाँ पढ़ें &rarr;
          </Link>
        </div>
      )}

      {!loading && poems.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {poems.map((p) => (
            <PoemCard key={p._id} poem={p} />
          ))}
        </div>
      )}
    </section>
  );
}
