import Link from 'next/link';
import { dbConnect } from '@/lib/mongodb';
import Poem from '@/lib/models/Poem';
import PoemCard from '@/components/PoemCard';
import TypewriterHero from '@/components/TypewriterHero';
import { CATEGORIES } from '@/lib/types';

export const revalidate = 0;

async function getData() {
  await dbConnect();
  const now = new Date();
  const publishedFilter = { published: true, $or: [{ scheduledAt: null }, { scheduledAt: { $lte: now } }] };

  const [featured, latest] = await Promise.all([
    Poem.findOne({ ...publishedFilter, featured: true }).sort({ createdAt: -1 }).lean(),
    Poem.find(publishedFilter).sort({ createdAt: -1 }).limit(6).lean(),
  ]);

  const featuredOrFallback = featured || latest[0] || null;

  return {
    featured: JSON.parse(JSON.stringify(featuredOrFallback)),
    latest: JSON.parse(JSON.stringify(latest)),
  };
}

export default async function HomePage() {
  const { featured, latest } = await getData();

  return (
    <>
      <TypewriterHero />

      <section className="mx-auto max-w-6xl px-5 md:px-8 py-16">
        {featured ? (
          <Link href={`/poems/${featured.slug}`} className="glass glow-hover block rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent mb-4">आज की शायरी</p>
            <h2 className="font-display text-2xl md:text-4xl text-accent-bright mb-4">{featured.title}</h2>
            <p className="poem-body text-parchment/90 max-w-2xl">
              {featured.body.split('\n').slice(0, 3).join('\n')}
            </p>
            <p className="text-sm text-muted mt-6 font-mono">लेखक: {featured.author} · {featured.category}</p>
          </Link>
        ) : (
          <div className="glass rounded-3xl p-12 text-center text-muted">
            अभी तक कोई शायरी नहीं है — एडमिन डैशबोर्ड से अपनी पहली शायरी जोड़ें।
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-5 md:px-8 py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/category/${encodeURIComponent(c)}`}
              className="text-xs px-4 py-2 rounded-full border border-accent text-muted hover:text-accent-bright hover:border-accent-bright transition-colors font-mono"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 md:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl text-accent-bright">नई शायरियाँ</h2>
          <Link href="/category" className="text-sm text-muted hover:text-accent-bright font-mono">
            सभी देखें &rarr;
          </Link>
        </div>
        {latest.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((p: any) => (
              <PoemCard key={p._id} poem={p} />
            ))}
          </div>
        ) : (
          <p className="text-muted text-center py-16">आपकी डायरी खाली है। पहला पन्ना लिखने का समय है।</p>
        )}
      </section>
    </>
  );
}