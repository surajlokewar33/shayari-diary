export type Comment = {
  _id?: string;
  name: string;
  text: string;
  createdAt?: string;
};

export type Poem = {
  _id: string;
  title: string;
  slug: string;
  body: string;
  language: 'English' | 'Hindi' | 'Urdu';
  category: string;
  tags: string[];
  author: string;
  audioUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  ambience: 'petals' | 'rain' | 'stars' | 'fireflies' | 'smoke' | 'none';
  likes: number;
  views: number;
  featured: boolean;
  published: boolean;
  scheduledAt?: string | null;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
};

export const CATEGORIES = [
  'Urdu Shayari',
  'Hindi Poems',
  'Ghazal',
  'Nazm',
  'Sher',
  'Video',
  'Others',
] as const;

export const CATEGORY_LABELS: Record<(typeof CATEGORIES)[number], string> = {
  'Urdu Shayari': 'उर्दू शायरी',
  'Hindi Poems': 'हिंदी कविताएँ',
  'Ghazal': 'ग़ज़ल',
  'Nazm': 'नज़्म',
  'Sher': 'शेर',
  'Video': 'वीडियो',
  'Others': 'अन्य',
};

export function readingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 130));
  return `${minutes} मिनट पढ़ें`;
}