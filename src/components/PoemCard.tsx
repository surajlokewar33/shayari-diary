import Link from 'next/link';
import { Poem, readingTime, CATEGORY_LABELS } from '@/lib/types';

const CATEGORY_ICONS: Record<string, string> = {
  'Urdu Shayari': '🖋️',
  'Hindi Poems': '📜',
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
      className="glass-journal glow-hover group block rounded-3xl p-6 sm:p-7 h-full flex flex-col justify-between border border-gold/25 relative overflow-hidden transition-all duration-300"
    >
      {/* Subtle corner ornament */}
      <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t border-r border-gold/30 rounded-tr-md pointer-events-none" />

      <div>
        {/* Card Header: Category Chip & Reading Time */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-amber font-ui">
            <span>{icon}</span>
            <span className="font-medium">{categoryLabel}</span>
          </span>
          <span className="text-[11px] text-muted font-ui tracking-wide">
            {readingTime(poem.body)}
          </span>
        </div>

        {/* Video Thumbnail Embed if video exists */}
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

        {/* Poem Title with language-specific RTL handling */}
        <h3
          dir={isUrdu ? 'rtl' : 'ltr'}
          className={`text-xl sm:text-2xl font-bold mb-3 text-parchment group-hover:text-amber transition-colors line-clamp-2 ${
            isUrdu ? 'font-urdu text-right text-2xl leading-relaxed' : 'font-devanagari'
          }`}
        >
          {poem.title}
        </h3>

        {/* Poem Excerpt with per-block RTL handling */}
        <p
          dir={isUrdu ? 'rtl' : 'ltr'}
          className={`text-sm text-cream/85 line-clamp-3 leading-relaxed whitespace-pre-line ${
            isUrdu ? 'font-urdu text-right text-lg' : 'font-devanagari'
          }`}
        >
          {excerpt}
        </p>
      </div>

      <div>
        {/* Divider */}
        <div className="ink-divider my-4 opacity-50" />

        {/* Card Footer: Author & Likes (stays LTR) */}
        <div className="flex items-center justify-between text-xs text-muted font-ui">
          <span className="flex items-center gap-1.5 text-cream/70 group-hover:text-amber transition-colors">
            <span>✍️</span>
            <span>{poem.author || 'सुरज लोकेवार (suru_33)'}</span>
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