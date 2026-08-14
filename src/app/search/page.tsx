'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PoemCard from '@/components/PoemCard';
import { Poem, CATEGORIES, CATEGORY_LABELS } from '@/lib/types';

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

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const handle = setTimeout(async () => {
      if (!q.trim() && !category) {
        setResults([]);
        setSearched(false);
        return;
      }
      setLoading(true);
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      if (category) params.set('category', category);
      try {
        const res = await fetch(`/api/poems?${params.toString()}`);
        const data = await res.json();
        setResults(data.poems || []);
      } catch (err) {
        console.error('Search request failed', err);
      } finally {
        setSearched(true);
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [q, category]);

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-12 md:py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-amber text-xs font-ui uppercase tracking-widest mb-4 font-semibold">
          <span>✦</span>
          <span>तलाश · Search</span>
          <span>✦</span>
        </div>

        <h1 className="font-devanagari text-4xl sm:text-5xl font-bold text-parchment mb-4">
          डायरी के पन्नों में खोजें
        </h1>

        <p className="font-devanagari text-base sm:text-lg text-cream leading-relaxed">
          शीर्षक, अल्फ़ाज़, मिसरे या किसी खास भाव के आधार पर रचनाएँ ढूँढें।
        </p>
      </div>

      {/* Search Input Bar & Category Selector */}
      <div className="max-w-3xl mx-auto mb-12 space-y-5">
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="जैसे: इश्क़, तन्हाई, ग़ज़ल, सफ़र, चाँद..."
            autoFocus
            className="w-full bg-transparent glass-journal rounded-full pl-14 pr-12 py-4 text-base sm:text-lg placeholder:text-muted/60 text-parchment border border-gold/35 focus:outline-none focus:border-amber transition-colors font-devanagari shadow-card min-h-[52px]"
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gold text-xl pointer-events-none">
            🔍
          </div>
          {q && (
            <button
              onClick={() => setQ('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-parchment text-lg w-8 h-8 flex items-center justify-center"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-2 rounded-full text-xs font-ui transition-all border min-h-[40px] flex items-center ${
              category === ''
                ? 'bg-gold/25 border-gold text-amber font-semibold shadow-sm'
                : 'glass border-gold/20 text-muted hover:text-parchment hover:border-gold/40'
            }`}
          >
            सभी विधाएँ
          </button>
          {CATEGORIES.map((c) => {
            const label = CATEGORY_LABELS[c] || c;
            const active = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(active ? '' : c)}
                className={`px-4 py-2 rounded-full text-xs font-ui transition-all border min-h-[40px] flex items-center ${
                  active
                    ? 'bg-gold/25 border-gold text-amber font-semibold shadow-sm'
                    : 'glass border-gold/20 text-muted hover:text-parchment hover:border-gold/40'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Skeleton State */}
      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Empty result */}
      {!loading && searched && results.length === 0 && (
        <div className="glass-journal rounded-3xl p-10 sm:p-12 text-center border border-gold/25 max-w-lg mx-auto shadow-card">
          <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-2xl mx-auto mb-4 text-amber shadow-sm">
            🔍
          </div>
          <h2 className="font-devanagari text-xl font-bold text-parchment mb-2">
            कोई रचना नहीं मिली
          </h2>
          <p className="text-sm font-ui text-cream/80 mb-6 leading-relaxed">
            {q ? `"${q}" से मेल खाती कोई शायरी नहीं मिली।` : 'इस श्रेणी में अभी कोई रचना उपलब्ध नहीं है।'} कृपया कोई दूसरा शब्द खोजें या अन्य काव्य विधाएँ देखें।
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/category"
              className="btn-primary text-xs"
            >
              श्रेणियाँ देखें &rarr;
            </Link>
            {q && (
              <button
                onClick={() => setQ('')}
                className="btn-ghost text-xs"
              >
                खोज साफ़ करें
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results grid */}
      {!loading && results.length > 0 && (
        <div>
          <p className="text-xs font-ui text-amber mb-6 font-semibold">
            {results.length} रचनाएँ मिलीं:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {results.map((p) => (
              <PoemCard key={p._id} poem={p} />
            ))}
          </div>
        </div>
      )}

      {/* Initial state placeholder */}
      {!searched && !loading && (
        <div className="glass-journal rounded-3xl p-12 text-center text-muted border border-gold/15 max-w-lg mx-auto">
          <p className="font-devanagari text-lg text-parchment mb-1">
            कुछ लफ़्ज़ लिखें और शायरी तलाशें
          </p>
          <p className="text-xs font-ui text-muted">
            शीर्षक, कविताओं के अंश या टैग के ज़रिए तुरंत खोजें।
          </p>
        </div>
      )}
    </section>
  );
}
