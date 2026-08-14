import { Metadata } from 'next';
import Link from 'next/link';
import InstagramEmbed from '@/components/InstagramEmbed';
import { REELS_DATA } from '@/data/reels';

export const metadata: Metadata = {
  title: 'काव्य रील्स · Instagram Reels — suru_33 / सूरु शाइर',
  description: 'Instagram पर प्रस्तुत स्वरचित शायरी, नज़्में और भावपूर्ण वीडियो कलाम। सूरु शाइर (@suru33_) की सभी रील्स देखें।',
};

const INSTAGRAM_PROFILE = 'https://www.instagram.com/suru33_?igsh=NnNhb2o4M2w5a2Zs';

export default function ReelsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-12 md:py-16">
      {/* Page Masthead */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-amber text-xs font-ui uppercase tracking-widest mb-4 font-semibold shadow-sm">
          <span>🎬</span>
          <span>दृश्य काव्य · Instagram Reels</span>
          <span>🎬</span>
        </div>

        <h1 className="font-devanagari text-3xl sm:text-4xl md:text-5xl font-bold text-parchment mb-4 leading-tight">
          शायरी रील्स एवं वीडियो कलाम
        </h1>

        <p className="font-devanagari text-base sm:text-lg text-cream/90 leading-relaxed mb-6">
          आवाज़, जज़्बात और अल्फ़ाज़ का संगम — Instagram पर प्रस्तुत स्वरचित रचनाओं का वीडियो संग्रह।
        </p>

        {/* Instagram Profile CTA */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs gap-2"
          >
            <span>Instagram पर फॉलो करें (@suru33_)</span>
            <span>↗</span>
          </a>
          <Link href="/category/Video" className="btn-secondary text-xs">
            वीडियो विधा देखें &rarr;
          </Link>
        </div>
      </div>

      {/* Reels Feed */}
      <div className="space-y-10 sm:space-y-14 max-w-2xl mx-auto">
        {REELS_DATA.map((reel, idx) => (
          <article
            key={reel.id}
            className="glass-journal rounded-3xl p-5 sm:p-8 border border-gold/30 shadow-card relative overflow-hidden glow-hover"
          >
            {/* Ornate corner */}
            <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-gold/30 rounded-tr-md pointer-events-none" />

            {/* Reel Header */}
            <div className="mb-4 pb-4 border-b border-gold/15 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-sm text-gold font-bold font-mono">
                  {idx + 1}
                </span>
                <div>
                  <h2 className="font-devanagari text-lg sm:text-xl font-bold text-parchment leading-snug">
                    {reel.title}
                  </h2>
                  {reel.date && (
                    <span className="text-xs font-ui text-muted">
                      {new Date(reel.date).toLocaleDateString('hi-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>

              {reel.tags && reel.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {reel.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-ui px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/20 text-muted"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Official Instagram Reel Player */}
            <div className="my-2">
              <InstagramEmbed url={reel.url} title={reel.title} />
            </div>

            {/* Reel Caption */}
            {reel.caption && (
              <p className="font-devanagari text-sm sm:text-base text-cream/90 leading-relaxed my-4 px-2">
                {reel.caption}
              </p>
            )}

            {/* Card Footer Actions */}
            <div className="pt-4 mt-4 border-t border-gold/15 flex items-center justify-between">
              <span className="text-xs font-ui text-muted flex items-center gap-1.5">
                <span>✍️</span>
                <span>सूरु शाइर (@suru33_)</span>
              </span>

              <a
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-ui text-amber hover:text-gold flex items-center gap-1 min-h-[36px] px-2 transition-colors font-medium"
              >
                <span>Instagram पर खोलें</span>
                <span>↗</span>
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom Footer Note */}
      <div className="mt-16 text-center max-w-md mx-auto p-6 rounded-2xl glass border border-gold/20">
        <p className="font-devanagari text-sm text-cream/80 mb-3">
          अधिक रील्स और दैनिक शायरी अपडेट्स के लिए Instagram पर जुड़ें।
        </p>
        <a
          href={INSTAGRAM_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-xs"
        >
          @suru33_ Profile ↗
        </a>
      </div>
    </div>
  );
}
