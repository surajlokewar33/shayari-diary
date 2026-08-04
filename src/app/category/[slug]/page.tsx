import { dbConnect } from '@/lib/mongodb';
import Poem from '@/lib/models/Poem';
import PoemCard from '@/components/PoemCard';

export const revalidate = 0;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = decodeURIComponent(params.slug);
  await dbConnect();
  const poems = await Poem.find({ category, published: true }).sort({ createdAt: -1 }).lean();

  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8 py-16">
      <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent mb-2">Category</p>
      <h1 className="font-display text-3xl text-accent-bright mb-10">{category}</h1>

      {poems.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {poems.map((p: any) => (
            <PoemCard key={p._id} poem={JSON.parse(JSON.stringify(p))} />
          ))}
        </div>
      ) : (
        <p className="text-muted text-center py-16">No poems in this category yet.</p>
      )}
    </section>
  );
}
