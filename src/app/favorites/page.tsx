'use client';

import { useEffect, useState } from 'react';
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
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8 py-16">
      <h1 className="font-display text-3xl text-accent-bright mb-2">Your Favorites</h1>
      <p className="text-muted mb-10">Poems you've saved to read again. Stored on this device.</p>

      {loading && <p className="text-muted text-center py-16">Loading…</p>}

      {!loading && poems.length === 0 && (
        <p className="text-muted text-center py-16">
          You haven't saved any poems yet. Tap ☆ on a poem to keep it here.
        </p>
      )}

      {!loading && poems.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {poems.map((p) => (
            <PoemCard key={p._id} poem={p} />
          ))}
        </div>
      )}
    </section>
  );
}
