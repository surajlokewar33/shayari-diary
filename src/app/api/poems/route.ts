import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Poem from '@/lib/models/Poem';
import { getSessionFromRequest } from '@/lib/auth';
import slugify from 'slugify';
import { nanoid } from 'nanoid';

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const q = searchParams.get('q');
  const featured = searchParams.get('featured');
  const limit = Number(searchParams.get('limit')) || 0;
  const includeUnpublished = searchParams.get('all') === '1';
  const ids = searchParams.get('ids');

  const session = await getSessionFromRequest(req);
  const filter: Record<string, unknown> = {};

  if (!includeUnpublished || !session) {
    filter.published = true;
    filter.$or = [{ scheduledAt: null }, { scheduledAt: { $lte: new Date() } }];
  }
  if (category) filter.category = category;
  if (featured === '1') filter.featured = true;
  if (q) {
    filter.$text = { $search: q };
  }
  if (ids) {
    filter._id = { $in: ids.split(',').filter(Boolean) };
  }

  let query = Poem.find(filter).sort({ createdAt: -1 });
  if (limit) query = query.limit(limit);

  const poems = await query.lean();
  return NextResponse.json({ poems });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  if (!data.title || !data.body || !data.category) {
    return NextResponse.json({ error: 'title, body and category are required' }, { status: 400 });
  }

  const baseSlug = slugify(data.title, { lower: true, strict: true }).slice(0, 80) || 'poem';
  let slug = baseSlug;
  const existing = await Poem.findOne({ slug });
  if (existing) slug = `${baseSlug}-${nanoid(5)}`;

  const poem = await Poem.create({
    title: data.title,
    slug,
    body: data.body,
    language: data.language || 'English',
    category: data.category,
    tags: Array.isArray(data.tags) ? data.tags : [],
    author: data.author || 'Anonymous',
    audioUrl: data.audioUrl || '',
    videoUrl: data.videoUrl || '',
    imageUrl: data.imageUrl || '',
    ambience: data.ambience || 'petals',
    featured: !!data.featured,
    published: data.published !== false,
    scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
  });

  return NextResponse.json({ poem }, { status: 201 });
}
