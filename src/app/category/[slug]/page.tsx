import Link from 'next/link';
import { dbConnect } from '@/lib/mongodb';
import Poem from '@/lib/models/Poem';
import PoemCard from '@/components/PoemCard';
import { CATEGORY_LABELS } from '@/lib/types';

export const revalidate = 0;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = decodeURIComponent(params.slug);
  const categoryLabel = CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ?? category;

  try {
    await dbConnect();
    const poems = await Poem.find({ category, published: true }).sort({ createdAt: -1 }).lean();

    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-12 md:py-16">
        <div className="mb-10 pb-6 border-b border-gold/20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted mb-2">
              <Link href="/category" className="text-gold-dim hover:text-gold-bright transition-colors">
                श्रेणियाँ
              </Link>
              <span>/</span>
              <span className="text-gold">{category}</span>
            </div>

            <h1 className="font-devanagari text-3xl sm:text-4xl md:text-5xl font-bold text-parchment">
              {categoryLabel}
            </h1>
          </div>

          <span className="text-xs font-mono px-3.5 py-1.5 rounded-full glass border border-gold/30 text-gold-bright shrink-0">
            {poems.length} रचनाएँ उपलब्ध
          </span>
        </div>

        {poems.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {poems.map((p: any) => (
              <PoemCard key={p._id} poem={JSON.parse(JSON.stringify(p))} />
            ))}
          </div>
        ) : (
          <div className="glass-journal rounded-3xl p-12 text-center text-muted border border-gold/20 max-w-lg mx-auto">
            <p className="font-devanagari text-lg mb-2">इस श्रेणी में अभी कोई शायरी प्रकाशित नहीं है।</p>
            <Link
              href="/category"
              className="inline-block mt-4 text-xs font-mono px-4 py-2 rounded-full glass border border-gold/30 text-gold-bright hover:border-gold"
            >
              &larr; अन्य श्रेणियाँ देखें
            </Link>
          </div>
        )}
      </section>
    );
  } catch (err) {
    console.error('Error fetching category poems:', err);
    return (
      <section className="mx-auto max-w-6xl px-5 md:px-8 py-16 text-center text-muted">
        रचनाएँ लोड करने में समस्या हुई।
      </section>
    );
  }
}
