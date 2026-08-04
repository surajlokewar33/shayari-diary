import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Poem from '@/lib/models/Poem';

// body: { delta: 1 | -1 }
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { delta } = await req.json();
  const inc = delta === -1 ? -1 : 1;

  const poem = await Poem.findByIdAndUpdate(
    params.id,
    { $inc: { likes: inc } },
    { new: true }
  ).lean();

  if (!poem) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ likes: (poem as any).likes });
}
