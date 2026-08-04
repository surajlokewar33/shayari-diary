'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Poem, CATEGORIES } from '@/lib/types';

type FormState = {
  title: string;
  body: string;
  language: 'English' | 'Hindi' | 'Urdu';
  category: string;
  tags: string;
  author: string;
  audioUrl: string;
  videoUrl: string;
  ambience: 'petals' | 'rain' | 'stars' | 'fireflies' | 'smoke' | 'none';
  featured: boolean;
  published: boolean;
  scheduledAt: string;
};

export default function PoemForm({ initial, poemId }: { initial?: Partial<Poem>; poemId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    title: initial?.title || '',
    body: initial?.body || '',
    language: initial?.language || 'English',
    category: initial?.category || CATEGORIES[0],
    tags: initial?.tags?.join(', ') || '',
    author: initial?.author || 'Anonymous',
    audioUrl: initial?.audioUrl || '',
    videoUrl: initial?.videoUrl || '',
    ambience: initial?.ambience || 'petals',
    featured: initial?.featured || false,
    published: initial?.published ?? true,
    scheduledAt: initial?.scheduledAt ? new Date(initial.scheduledAt).toISOString().slice(0, 16) : '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      scheduledAt: form.scheduledAt || null,
    };
    try {
      const res = await fetch(poemId ? `/api/poems/${poemId}` : '/api/poems', {
        method: poemId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-5">
      <div>
        <label className="text-xs text-muted font-mono block mb-1">Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          className="w-full bg-transparent border border-accent rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-bright"
        />
      </div>

      <div>
        <label className="text-xs text-muted font-mono block mb-1">Poem text</label>
        <textarea
          required
          rows={8}
          value={form.body}
          onChange={(e) => update('body', e.target.value)}
          className="w-full bg-transparent border border-accent rounded-lg px-3 py-2 text-sm font-display focus:outline-none focus:border-accent-bright"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-muted font-mono block mb-1">Language</label>
          <select
            value={form.language}
            onChange={(e) => update('language', e.target.value as FormState['language'])}
            className="w-full bg-ink border border-accent rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Urdu</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted font-mono block mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className="w-full bg-ink border border-accent rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted font-mono block mb-1">Ambience</label>
          <select
            value={form.ambience}
            onChange={(e) => update('ambience', e.target.value as FormState['ambience'])}
            className="w-full bg-ink border border-accent rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            <option value="petals">Falling Petals</option>
            <option value="rain">Soft Rain</option>
            <option value="stars">Stars</option>
            <option value="fireflies">Fireflies</option>
            <option value="smoke">Smoke</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted font-mono block mb-1">Author</label>
          <input
            value={form.author}
            onChange={(e) => update('author', e.target.value)}
            className="w-full bg-transparent border border-accent rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-bright"
          />
        </div>
        <div>
          <label className="text-xs text-muted font-mono block mb-1">Tags (comma separated)</label>
          <input
            value={form.tags}
            onChange={(e) => update('tags', e.target.value)}
            placeholder="longing, monsoon, night"
            className="w-full bg-transparent border border-accent rounded-lg px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:border-accent-bright"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted font-mono block mb-1">Audio recitation URL (optional)</label>
          <input
            value={form.audioUrl}
            onChange={(e) => update('audioUrl', e.target.value)}
            placeholder="https://.../recitation.mp3"
            className="w-full bg-transparent border border-accent rounded-lg px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:border-accent-bright"
          />
        </div>
        <div>
          <label className="text-xs text-muted font-mono block mb-1">Background video URL (optional)</label>
          <input
            value={form.videoUrl}
            onChange={(e) => update('videoUrl', e.target.value)}
            placeholder="https://.../rain.mp4"
            className="w-full bg-transparent border border-accent rounded-lg px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:border-accent-bright"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 items-end">
        <div>
          <label className="text-xs text-muted font-mono block mb-1">Schedule for later (optional)</label>
          <input
            type="datetime-local"
            value={form.scheduledAt}
            onChange={(e) => update('scheduledAt', e.target.value)}
            className="w-full bg-ink border border-accent rounded-lg px-3 py-2 text-sm focus:outline-none"
          />
        </div>
        <div className="flex gap-6 pb-2">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} />
            Published
          </label>
        </div>
      </div>

      {error && <p className="text-rose text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="text-sm px-5 py-2.5 rounded-full bg-accent/20 border border-accent text-accent-bright hover:bg-accent/30 transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving…' : poemId ? 'Save changes' : 'Publish poem'}
      </button>
    </form>
  );
}
