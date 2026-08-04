import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Poem from '@/lib/models/Poem';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { name, text } = await req.json();
  if (!text || !text.trim()) {
    return NextResponse.json({ error: 'Comment text required' }, { status: 400 });
  }

  const poem = await Poem.findByIdAndUpdate(
    params.id,
    { $push: { comments: { name: (name || 'Anonymous').slice(0, 60), text: text.slice(0, 1000) } } },
    { new: true }
  ).lean();

  if (!poem) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ comments: (poem as any).comments });
}
