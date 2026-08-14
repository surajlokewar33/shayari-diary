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
  const [fetchError, setFetchError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setFetchError(null);

    try {
      const [poemsRes, meRes] = await Promise.all([
        fetch('/api/poems?all=1'),
        fetch('/api/auth/me'),
      ]);

      if (!meRes.ok) {
        const text = await meRes.text();
        console.error('auth/me fetch failed:', meRes.status, text);
        router.push('/admin/login');
        return;
      }

      const meData = await meRes.json();
      if (!meData.authenticated) {
        router.push('/admin/login');
        return;
      }
      setUsername(meData.username || '');

      if (!poemsRes.ok) {
        const text = await poemsRes.text();
        console.error('poems fetch failed:', poemsRes.status, text);
        throw new Error(`Poems API failed with status ${poemsRes.status}`);
      }

      const poemsData = await poemsRes.json();
      setPoems(poemsData.poems || []);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setFetchError(err.message || 'डेटा लोड करने में त्रुटि हुई');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('क्या आप वाकई इस रचना को हमेशा के लिए हटाना चाहते हैं?')) return;
    try {
      const res = await fetch(`/api/poems/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setPoems((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      alert('हटाने में समस्या हुई');
    }
  }

  async function togglePublish(poem: Poem) {
    try {
      const res = await fetch(`/api/poems/${poem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !poem.published }),
      });
      const data = await res.json();
      if (res.ok && data.poem) {
        setPoems((p) => p.map((x) => (x._id === poem._id ? data.poem : x)));
      }
    } catch (err) {
      console.error('Toggle publish failed:', err);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  const totalLikes = poems.reduce((s, p) => s + (p.likes || 0), 0);
  const totalViews = poems.reduce((s, p) => s + (p.views || 0), 0);

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-12 md:py-16">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-gold/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-amber text-xs font-ui uppercase tracking-widest mb-2 font-semibold">
            <span>⚙️</span>
            <span>एडमिन डैशबोर्ड · Admin Dashboard</span>
          </div>
          <h1 className="font-devanagari text-3xl sm:text-4xl font-bold text-parchment">
            डायरी प्रबंधन
          </h1>
          {username && (
            <p className="text-muted text-xs font-ui mt-1">
              लॉगिन: <span className="text-amber font-semibold">{username}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/new" className="btn-primary text-xs">
            + नई शायरी लिखें
          </Link>
          <button onClick={handleLogout} className="btn-ghost text-xs">
            लॉग आउट
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {fetchError && (
        <div className="glass-journal rounded-2xl p-4 mb-8 border border-rose/40 text-rose text-sm flex items-center justify-between">
          <span>⚠️ {fetchError}</span>
          <button onClick={load} className="btn-secondary text-xs">
            पुनः प्रयास करें
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <div className="glass-journal rounded-2xl p-6 text-center border border-gold/25 shadow-card">
          <p className="text-3xl sm:text-4xl font-bold text-amber font-mono">{poems.length}</p>
          <p className="text-xs text-muted font-ui uppercase tracking-wider mt-2">कुल रचनाएँ (Total Poems)</p>
        </div>
        <div className="glass-journal rounded-2xl p-6 text-center border border-gold/25 shadow-card">
          <p className="text-3xl sm:text-4xl font-bold text-parchment font-mono">{totalViews}</p>
          <p className="text-xs text-muted font-ui uppercase tracking-wider mt-2">कुल पाठक (Total Views)</p>
        </div>
        <div className="glass-journal rounded-2xl p-6 text-center border border-gold/25 shadow-card">
          <p className="text-3xl sm:text-4xl font-bold text-rose font-mono">{totalLikes}</p>
          <p className="text-xs text-muted font-ui uppercase tracking-wider mt-2">कुल पसंद (Total Likes)</p>
        </div>
      </div>

      {/* Loading & Empty states */}
      {loading && (
        <div className="glass-journal rounded-2xl p-12 text-center text-muted border border-gold/20">
          <p className="font-devanagari text-base mb-1">रचनाएँ लोड हो रही हैं…</p>
        </div>
      )}

      {!loading && poems.length === 0 && !fetchError && (
        <div className="glass-journal rounded-2xl p-12 text-center text-muted border border-gold/20">
          <p className="font-devanagari text-lg text-parchment mb-2">डायरी में अभी कोई रचना नहीं है।</p>
          <Link href="/admin/new" className="btn-primary text-xs mt-3">
            + पहली शायरी जोड़ें
          </Link>
        </div>
      )}

      {/* Poems List */}
      <div className="space-y-3">
        {poems.map((p) => (
          <div
            key={p._id}
            className="glass-journal rounded-2xl p-5 border border-gold/20 flex flex-wrap items-center justify-between gap-4 glow-hover"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                <Link
                  href={`/poems/${p.slug}`}
                  target="_blank"
                  className="font-devanagari text-lg font-bold text-parchment hover:text-amber transition-colors truncate"
                >
                  {p.title}
                </Link>
                {!p.published && (
                  <span className="text-[10px] font-ui px-2 py-0.5 rounded-full border border-gold/30 bg-gold/10 text-amber">
                    ड्राफ्ट (Draft)
                  </span>
                )}
                {p.featured && (
                  <span className="text-[10px] font-ui px-2 py-0.5 rounded-full border border-rose/30 bg-rose/10 text-rose">
                    ★ खास रचना (Featured)
                  </span>
                )}
                {p.scheduledAt && new Date(p.scheduledAt) > new Date() && (
                  <span className="text-[10px] font-ui px-2 py-0.5 rounded-full border border-gold/20 text-muted">
                    शेड्यूल: {new Date(p.scheduledAt).toLocaleDateString('hi-IN')}
                  </span>
                )}
              </div>

              <p className="text-xs text-muted font-ui flex items-center gap-3">
                <span className="text-cream/80">{p.category}</span>
                <span>·</span>
                <span>👁 {p.views} पाठक</span>
                <span>·</span>
                <span className="text-rose font-medium">♥ {p.likes} पसंद</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => togglePublish(p)}
                className={`text-xs px-3 py-1.5 rounded-full border min-h-[36px] transition-colors ${
                  p.published
                    ? 'border-gold/30 text-muted hover:text-parchment hover:border-gold'
                    : 'border-gold bg-gold/20 text-amber font-semibold'
                }`}
              >
                {p.published ? 'अप्रकाशित करें' : 'प्रकाशित करें'}
              </button>

              <Link
                href={`/admin/edit/${p._id}`}
                className="btn-secondary text-xs min-h-[36px] px-3.5"
              >
                संपादित करें (Edit)
              </Link>

              <button
                onClick={() => handleDelete(p._id)}
                className="text-xs px-3 py-1.5 rounded-full border border-rose/40 text-rose hover:bg-rose/15 min-h-[36px] transition-colors"
              >
                हटाएँ (Delete)
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
