import Link from 'next/link';
import { Poem, readingTime, CATEGORY_LABELS } from '@/lib/types';

const langFont: Record<string, string> = {
  Urdu: 'font-urdu text-right',
  Hindi: 'font-devanagari',
  English: 'font-display',
};

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function PoemCard({ poem }: { poem: Poem }) {
  const excerpt = poem.body.split('\n').filter(Boolean).slice(0, 2).join(' / ');
  const categoryLabel = CATEGORY_LABELS[poem.category as keyof typeof CATEGORY_LABELS] ?? poem.category;
  const embedUrl = poem.videoUrl ? getYouTubeEmbedUrl(poem.videoUrl) : null;

  return (
    <Link
      href={`/poems/${poem.slug}`}
      className="glass glow-hover group block rounded-2xl p-6 h-full flex flex-col justify-between animate-fade-up"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] tracking-widest uppercase text-muted font-mono">{categoryLabel}</span>
          <span className="text-[11px] text-muted font-mono">{readingTime(poem.body)}</span>
        </div>

        {embedUrl && (
          <div className="mb-3 rounded-xl overflow-hidden aspect-video">
            <iframe
              src={embedUrl}
              title={poem.title}
              className="w-full h-full pointer-events-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <h3 className={`text-xl mb-2 text-accent-bright group-hover:text-accent transition-colors ${langFont[poem.language]}`}>
          {poem.title}
        </h3>
        <p className={`text-sm text-muted line-clamp-3 ${poem.language !== 'English' ? langFont[poem.language] : ''}`}>
          {excerpt}
        </p>
      </div>
      <div className="ink-divider my-4" />
      <div className="flex items-center justify-between text-xs text-muted font-mono">
        <span>लेखक: {poem.author}</span>
        <span>♡ {poem.likes}</span>
      </div>
    </Link>
  );
}