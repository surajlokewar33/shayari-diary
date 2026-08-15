import { notFound } from 'next/navigation';
import { dbConnect } from '@/lib/mongodb';
import Poem from '@/lib/models/Poem';
import PoemView from './PoemView';
import type { Metadata } from 'next';
import JsonLd, { poemSchema } from '@/components/JsonLd';

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
  const description = data.poem.body.slice(0, 140);
  return {
    title: data.poem.title,
    description,
    openGraph: {
      title: data.poem.title,
      description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.poem.title,
      description,
    },
    alternates: {
      canonical: `/poems/${params.slug}`,
    },
  };
}

export default async function PoemPage({ params }: { params: { slug: string } }) {
  const data = await getPoem(params.slug);
  if (!data) notFound();
  return (
    <>
      <JsonLd data={poemSchema(data.poem)} />
      <PoemView poem={data.poem} related={data.related} />
    </>
  );
}
