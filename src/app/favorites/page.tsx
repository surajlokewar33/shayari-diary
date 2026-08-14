'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PoemCard from '@/components/PoemCard';
import { Poem } from '@/lib/types';
import { getFavorites } from '@/lib/favorites';

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
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass border border-gold/30 text-amber text-xs font-ui uppercase tracking-widest mb-4">
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
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mb-4" />
          <p className="text-xs font-ui text-muted">लोड हो रहा है…</p>
        </div>
      )}

      {!loading && poems.length === 0 && (
        <div className="glass-journal rounded-3xl p-12 text-center text-muted border border-gold/20 max-w-md mx-auto">
          <div className="text-4xl mb-4 text-gold">☆</div>
          <p className="font-devanagari text-lg text-parchment mb-2">
            आपने अभी तक कोई शायरी सहेजी नहीं है।
          </p>
          <p className="text-xs font-ui text-muted mb-6">
            किसी भी रचना पर ★ दबाकर उसे यहाँ सहेजें।
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 rounded-full bg-gold/15 hover:bg-gold/25 border border-gold/40 text-amber text-xs font-ui transition-all"
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
