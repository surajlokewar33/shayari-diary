import { MetadataRoute } from 'next';
import { dbConnect } from '@/lib/mongodb';
import Poem from '@/lib/models/Poem';
import { CATEGORIES } from '@/lib/types';

const BASE_URL = 'https://suraurshayari.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/category`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/reels`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/favorites`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  // Category routes
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${BASE_URL}/category/${encodeURIComponent(c)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Dynamic poem routes
  let poemRoutes: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    const poems = await Poem.find({ published: true })
      .select('slug updatedAt createdAt')
      .lean();
    poemRoutes = poems.map((p: any) => ({
      url: `${BASE_URL}/poems/${p.slug}`,
      lastModified: p.updatedAt || p.createdAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    }));
  } catch (err) {
    console.error('Sitemap: Error fetching poems:', err);
  }

  return [...staticRoutes, ...categoryRoutes, ...poemRoutes];
}
