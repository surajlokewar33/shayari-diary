import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Poem from '@/lib/models/Poem';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  await dbConnect();
  const poem = await Poem.findOneAndUpdate(
    { slug: params.slug },
    { $inc: { views: 1 } },
    { new: true }
  ).lean();

  if (!poem) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const related = await Poem.find({
    category: (poem as any).category,
    _id: { $ne: (poem as any)._id },
    published: true,
  })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  return NextResponse.json({ poem, related });
}
