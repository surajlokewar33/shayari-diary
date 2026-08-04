import { notFound } from 'next/navigation';
import { dbConnect } from '@/lib/mongodb';
import Poem from '@/lib/models/Poem';
import PoemView from './PoemView';
import type { Metadata } from 'next';

export const revalidate = 0;

async function getPoem(slug: string) {
  await dbConnect();
  const poem = await Poem.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true }).lean();
  if (!poem) return null;
  const related = await Poem.find({
    category: (poem as any).category,
    _id: { $ne: (poem as any)._id },
    published: true,
  })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();
  return { poem: JSON.parse(JSON.stringify(poem)), related: JSON.parse(JSON.stringify(related)) };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getPoem(params.slug);
  if (!data) return {};
  return {
    title: `${data.poem.title} — Inkwell`,
    description: data.poem.body.slice(0, 140),
    openGraph: { title: data.poem.title, description: data.poem.body.slice(0, 140) },
  };
}

export default async function PoemPage({ params }: { params: { slug: string } }) {
  const data = await getPoem(params.slug);
  if (!data) notFound();
  return <PoemView poem={data.poem} related={data.related} />;
}
