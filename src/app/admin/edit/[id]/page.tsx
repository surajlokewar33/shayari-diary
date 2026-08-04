import { notFound } from 'next/navigation';
import { dbConnect } from '@/lib/mongodb';
import Poem from '@/lib/models/Poem';
import PoemForm from '@/components/PoemForm';

export const revalidate = 0;

export default async function EditPoemPage({ params }: { params: { id: string } }) {
  await dbConnect();
  let poem;
  try {
    poem = await Poem.findById(params.id).lean();
  } catch {
    poem = null;
  }
  if (!poem) notFound();

  return (
    <section className="mx-auto max-w-3xl px-5 md:px-8 py-16">
      <h1 className="font-display text-3xl text-accent-bright mb-8">Edit poem</h1>
      <PoemForm initial={JSON.parse(JSON.stringify(poem))} poemId={params.id} />
    </section>
  );
}
