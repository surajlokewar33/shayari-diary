import { ImageResponse } from 'next/og';
import { buildOgImage } from '@/lib/ogImageTemplate';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'सूरु 33 · शाइर';

export default async function Image({ params }: { params: { slug: string } }) {
  return buildOgImage(params.slug);
}