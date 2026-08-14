import Link from 'next/link';
import { Poem, readingTime, CATEGORY_LABELS } from '@/lib/types';

const CATEGORY_ICONS: Record<string, string> = {
  'Urdu Shayari': '🖋️',
  'Hindi Poems': '📜',
  'Marathi': '🌺',
  'Ghazal': '🌙',
  'Nazm': '🎋',
  'Sher': '✒️',
  'Video': '🎬',
  'Others': '📖',
};

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function PoemCard({ poem }: { poem: Poem }) {
  const excerpt = poem.body.split('\n').filter(Boolean).slice(0, 2).join('\n');
  const categoryLabel = CATEGORY_LABELS[poem.category as keyof typeof CATEGORY_LABELS] ?? poem.category;
  const icon = CATEGORY_ICONS[poem.category] || '✒️';
  const embedUrl = poem.videoUrl ? getYouTubeEmbedUrl(poem.videoUrl) : null;
  const isUrdu = poem.language === 'Urdu';

  return (
    <Link
      href={`/poems/${poem.slug}`}
      className="glass-journal glow-hover group rounded-3xl p-6 sm:p-7 h-full flex flex-col justify-between border border-gold/25 relative overflow-hidden transition-all duration-300 min-h-[260px]"
    >
      {/* Subtle corner ornament */}
      <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-gold/30 rounded-tr-md pointer-events-none" />

      <div>
        {/* Visual Hierarchy Step 1: Category Badge & Reading Time */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-amber font-ui font-medium">
            <span>{icon}</span>
            <span>{categoryLabel}</span>
          </span>
          <span className="text-xs text-muted font-ui tracking-wide">
            {readingTime(poem.body)}
          </span>
        </div>

        {/* Optional Media Preview */}
        {embedUrl && (
          <div className="mb-4 rounded-2xl overflow-hidden aspect-video border border-gold/20 shadow-md bg-black">
            <iframe
              src={embedUrl}
              title={poem.title}
              className="w-full h-full pointer-events-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Visual Hierarchy Step 2: Poem Title */}
        <h3
          dir={isUrdu ? 'rtl' : 'ltr'}
          className={`text-xl sm:text-2xl font-bold mb-3 text-parchment group-hover:text-amber transition-colors line-clamp-2 leading-snug ${
            isUrdu ? 'font-devanagari text-right' : 'font-devanagari'
          }`}
        >
          {poem.title}
        </h3>

        {/* Visual Hierarchy Step 3: Excerpt */}
        <p
          dir={isUrdu ? 'rtl' : 'ltr'}
          className={`text-sm sm:text-base text-cream/85 line-clamp-3 leading-relaxed whitespace-pre-line ${
            isUrdu ? 'font-devanagari text-right' : 'font-devanagari'
          }`}
        >
          {excerpt}
        </p>
      </div>

      {/* Visual Hierarchy Step 4: Footer Metadata (Author & Likes) */}
      <div className="pt-4 mt-4 border-t border-gold/15">
        <div className="flex items-center justify-between text-xs text-muted font-ui">
          <span className="flex items-center gap-1.5 text-cream/75 group-hover:text-amber transition-colors font-medium">
            <span>✍️</span>
            <span>{poem.author || 'सुरज लोकेवार (मुरीद शाइर)'}</span>
          </span>

          <span className="flex items-center gap-1 text-rose font-semibold">
            <span>♥</span>
            <span>{poem.likes || 0}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}