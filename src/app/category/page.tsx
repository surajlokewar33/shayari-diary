import Link from 'next/link';
import { dbConnect } from '@/lib/mongodb';
import Poem from '@/lib/models/Poem';
import { CATEGORIES } from '@/lib/types';

export const revalidate = 0;

const EMOJI: Record<string, string> = {
  Love: '❤️',
  Friendship: '🤝',
  Motivation: '💪',
  Sad: '😔',
  Life: '🌿',
  Nature: '🌸',
  'Urdu Shayari': '🖋️',
  'Hindi Poems': '📜',
};

export default async function CategoryIndexPage() {
  await dbConnect();
  const counts = await Poem.aggregate([
    { $match: { published: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const countMap: Record<string, number> = {};
  counts.forEach((c) => (countMap[c._id] = c.count));

  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8 py-16">
      <h1 className="font-display text-3xl text-accent-bright mb-2">Categories</h1>
      <p className="text-muted mb-10">Find the verses that match your mood.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CATEGORIES.map((c) => (
          <Link key={c} href={`/category/${encodeURIComponent(c)}`} className="glass glow-hover rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">{EMOJI[c]}</div>
            <div className="font-display text-lg text-accent-bright">{c}</div>
            <div className="text-xs text-muted font-mono mt-1">{countMap[c] || 0} poems</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
