'use client';

import { useEffect, useState } from 'react';
import PoemCard from '@/components/PoemCard';
import { Poem, CATEGORIES, CATEGORY_LABELS } from '@/lib/types';

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
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass border border-gold/30 text-gold-bright text-xs font-mono uppercase tracking-widest mb-4">
          <span>✦</span>
          <span>तलाश · Search</span>
          <span>✦</span>
        </div>

        <h1 className="font-devanagari text-4xl sm:text-5xl font-bold text-parchment mb-4">
          डायरी के पन्नों में खोजें
        </h1>

        <p className="font-devanagari text-base sm:text-lg text-parchment-aged leading-relaxed">
          शीर्षक, अल्फ़ाज़, मिसरे या किसी खास भाव के आधार पर रचनाएँ ढूँढें।
        </p>
      </div>

      {/* Search Input Bar & Category Selector */}
      <div className="max-w-3xl mx-auto mb-12 space-y-4">
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="जैसे: इश्क़, तन्हाई, ग़ज़ल, सफ़र, चाँद..."
            autoFocus
            className="w-full bg-transparent glass-journal rounded-full pl-14 pr-12 py-4 text-base sm:text-lg placeholder:text-muted/60 text-parchment border border-gold/35 focus:outline-none focus:border-gold transition-colors font-devanagari shadow-journal"
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gold text-xl pointer-events-none">
            🔍
          </div>
          {q && (
            <button
              onClick={() => setQ('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-parchment text-lg"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setCategory('')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all border ${
              category === ''
                ? 'bg-gold/25 border-gold text-gold-bright font-semibold'
                : 'glass border-gold/20 text-muted hover:text-parchment'
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all border ${
                  active
                    ? 'bg-gold/25 border-gold text-gold-bright font-semibold'
                    : 'glass border-gold/20 text-muted hover:text-parchment'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mb-4" />
          <p className="text-xs font-mono text-muted">तलाश जारी है…</p>
        </div>
      )}

      {/* Empty result */}
      {!loading && searched && results.length === 0 && (
        <div className="glass-journal rounded-3xl p-12 text-center text-muted border border-gold/20 max-w-md mx-auto">
          <p className="font-devanagari text-lg text-parchment mb-2">कोई रचना नहीं मिली</p>
          <p className="text-xs font-mono text-muted">
            कृपया कोई दूसरा शब्द खोजें या श्रेणी बदलकर देखें।
          </p>
        </div>
      )}

      {/* Results grid */}
      {!loading && results.length > 0 && (
        <div>
          <p className="text-xs font-mono text-gold-bright mb-6">
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
          <p className="text-xs font-mono text-muted">
            शीर्षक, कविताओं के अंश या टैग के ज़रिए तुरंत खोजें।
          </p>
        </div>
      )}
    </section>
  );
}
