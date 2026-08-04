'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Poem } from '@/lib/types';

export default function AdminDashboard() {
  const router = useRouter();
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  async function load() {
    setLoading(true);
    const [poemsRes, meRes] = await Promise.all([
      fetch('/api/poems?all=1'),
      fetch('/api/auth/me'),
    ]);
    const poemsData = await poemsRes.json();
    const meData = await meRes.json();
    setPoems(poemsData.poems || []);
    setUsername(meData.username || '');
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this poem permanently?')) return;
    await fetch(`/api/poems/${id}`, { method: 'DELETE' });
    setPoems((p) => p.filter((x) => x._id !== id));
  }

  async function togglePublish(poem: Poem) {
    const res = await fetch(`/api/poems/${poem._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !poem.published }),
    });
    const data = await res.json();
    setPoems((p) => p.map((x) => (x._id === poem._id ? data.poem : x)));
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  const totalLikes = poems.reduce((s, p) => s + (p.likes || 0), 0);
  const totalViews = poems.reduce((s, p) => s + (p.views || 0), 0);

  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-3xl text-accent-bright">Dashboard</h1>
          <p className="text-muted text-sm mt-1">Signed in as {username}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/new" className="text-sm px-4 py-2 rounded-full bg-accent/20 border border-accent text-accent-bright hover:bg-accent/30 transition-colors">
            + New Poem
          </Link>
          <button onClick={handleLogout} className="text-sm px-4 py-2 rounded-full border border-accent text-muted hover:text-accent-bright transition-colors">
            Log out
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-3xl font-display text-accent-bright">{poems.length}</p>
          <p className="text-xs text-muted font-mono mt-1">Total Poems</p>
        </div>
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-3xl font-display text-accent-bright">{totalViews}</p>
          <p className="text-xs text-muted font-mono mt-1">Total Views</p>
        </div>
        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-3xl font-display text-accent-bright">{totalLikes}</p>
          <p className="text-xs text-muted font-mono mt-1">Total Likes</p>
        </div>
      </div>

      {loading && <p className="text-muted text-center py-16">Loading…</p>}

      {!loading && poems.length === 0 && (
        <p className="text-muted text-center py-16">No poems yet. Start writing your first one.</p>
      )}

      <div className="space-y-3">
        {poems.map((p) => (
          <div key={p._id} className="glass rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-display text-accent-bright truncate">{p.title}</p>
                {!p.published && <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-accent text-muted">draft</span>}
                {p.featured && <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-rose text-rose">featured</span>}
                {p.scheduledAt && new Date(p.scheduledAt) > new Date() && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-accent text-muted">
                    scheduled {new Date(p.scheduledAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted font-mono mt-1">{p.category} · {p.views} views · {p.likes} likes</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => togglePublish(p)} className="text-xs px-3 py-1.5 rounded-full border border-accent text-muted hover:text-accent-bright">
                {p.published ? 'Unpublish' : 'Publish'}
              </button>
              <Link href={`/admin/edit/${p._id}`} className="text-xs px-3 py-1.5 rounded-full border border-accent text-muted hover:text-accent-bright">
                Edit
              </Link>
              <button onClick={() => handleDelete(p._id)} className="text-xs px-3 py-1.5 rounded-full border border-rose text-rose hover:bg-rose/10">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
