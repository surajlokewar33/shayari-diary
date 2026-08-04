'use client';

import { useEffect, useState } from 'react';
import PoemCard from '@/components/PoemCard';
import { Poem, CATEGORIES } from '@/lib/types';

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
      const res = await fetch(`/api/poems?${params.toString()}`);
      const data = await res.json();
      setResults(data.poems || []);
      setSearched(true);
      setLoading(false);
    }, 350);
    return () => clearTimeout(handle);
  }, [q, category]);

  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8 py-16">
      <h1 className="font-display text-3xl text-accent-bright mb-2">Search the Diary</h1>
      <p className="text-muted mb-8">Search by title, keyword, or tag.</p>

      <div className="flex flex-col md:flex-row gap-3 mb-10">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search poems, keywords, tags..."
          autoFocus
          className="flex-1 bg-transparent glass rounded-full px-5 py-3 text-sm placeholder:text-muted focus:outline-none focus:border-accent-bright"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="glass rounded-full px-5 py-3 text-sm bg-transparent text-muted focus:outline-none"
        >
          <option value="" className="bg-ink">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-ink">{c}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-muted text-center py-10">Searching…</p>}

      {!loading && searched && results.length === 0 && (
        <p className="text-muted text-center py-16">No poems match your search.</p>
      )}

      {!loading && results.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((p) => (
            <PoemCard key={p._id} poem={p} />
          ))}
        </div>
      )}

      {!searched && !loading && (
        <p className="text-muted text-center py-16">Start typing to search the whole diary.</p>
      )}
    </section>
  );
}
