import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Poem from '@/lib/models/Poem';
import { getSessionFromRequest } from '@/lib/auth';
import slugify from 'slugify';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const poem = await Poem.findById(params.id).lean();
  if (!poem) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ poem });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.json();
  const update: Record<string, unknown> = { ...data };
  delete update._id;
  delete update.slug;

  if (data.title) {
    const existing = await Poem.findById(params.id).lean();
    if (existing && data.title !== (existing as any).title) {
      update.slug = slugify(data.title, { lower: true, strict: true }).slice(0, 80) || 'poem';
    }
  }
  if (data.scheduledAt !== undefined) {
    update.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null;
  }

  const poem = await Poem.findByIdAndUpdate(params.id, update, { new: true });
  if (!poem) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ poem });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const poem = await Poem.findByIdAndDelete(params.id);
  if (!poem) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
