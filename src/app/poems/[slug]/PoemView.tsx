'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Poem, readingTime, CATEGORY_LABELS } from '@/lib/types';
import { isFavorite, toggleFavorite, hasLiked, setLiked } from '@/lib/favorites';
import AmbientCanvas from '@/components/AmbientCanvas';
import PoemCard from '@/components/PoemCard';

export default function PoemView({ poem, related }: { poem: Poem; related: Poem[] }) {
  const [likes, setLikes] = useState(poem.likes);
  const [liked, setLikedState] = useState(hasLiked(poem._id));
  const [fav, setFav] = useState(isFavorite(poem._id));
  const [copied, setCopied] = useState(false);

  const isUrdu = poem.language === 'Urdu';
  const categoryLabel = CATEGORY_LABELS[poem.category as keyof typeof CATEGORY_LABELS] ?? poem.category;

  async function handleLike() {
    const nextLiked = !liked;
    const delta = nextLiked ? 1 : -1;
    setLikedState(nextLiked);
    setLiked(poem._id, nextLiked);
    setLikes((l) => l + delta);
    try {
      await fetch(`/api/poems/${poem._id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta }),
      });
    } catch {
      setLikedState(!nextLiked);
      setLiked(poem._id, !nextLiked);
      setLikes((l) => l - delta);
    }
  }

  function handleFavorite() {
    setFav(toggleFavorite(poem._id));
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(`${poem.title}\n\n${poem.body}\n\n— ${poem.author || 'सुरज लोकेवार'} (suru_33)`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleNativeShare() {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      navigator.share({
        title: poem.title,
        text: `"${poem.title}" — suru_33 / सूरु शाइर`,
        url: window.location.href,
      }).catch(() => {});
    }
  }

  return (
    <article className="relative min-h-screen py-6 md:py-12">
      {/* Background Ambience Animation */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <AmbientCanvas mode={poem.ambience} />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
        {/* Main Journal Page Card */}
        <div className="glass-journal rounded-3xl p-6 sm:p-10 md:p-14 border border-gold/35 shadow-journal relative overflow-hidden">
          {/* Decorative low-opacity watermark quote-mark */}
          <div className="absolute top-6 right-8 text-7xl sm:text-9xl font-serif text-gold/5 pointer-events-none select-none">
            ❝
          </div>

          {/* Ornate Corner Flourishes */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gold/40 rounded-tl-md pointer-events-none" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gold/40 rounded-tr-md pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gold/40 rounded-bl-md pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gold/40 rounded-br-md pointer-events-none" />

          {/* Breadcrumb / Category Metadata (stays LTR) */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-ui text-muted mb-8 pb-4 border-b border-gold/20">
            <div className="flex items-center gap-2">
              <Link
                href={`/category/${encodeURIComponent(poem.category)}`}
                className="px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-amber hover:bg-gold/25 transition-colors"
              >
                {categoryLabel}
              </Link>
              <span>·</span>
              <span>{readingTime(poem.body)}</span>
            </div>

            <div className="flex items-center gap-3 text-muted">
              <span>👁 {poem.views} बार पढ़ा गया</span>
              <span>·</span>
              <span>{new Date(poem.createdAt).toLocaleDateString('hi-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Poem Title with language-aware RTL */}
          <h1
            dir={isUrdu ? 'rtl' : 'ltr'}
            className={`font-bold text-3xl sm:text-4xl md:text-5xl text-parchment mb-4 drop-shadow-sm ${
              isUrdu ? 'font-urdu text-right leading-loose' : 'font-devanagari'
            }`}
          >
            {poem.title}
          </h1>

          <p className="text-sm font-ui text-amber flex items-center gap-2 mb-8">
            <span>✍️</span>
            <span>{poem.author || 'सुरज लोकेवार (suru_33)'}</span>
          </p>

          {/* The Poem Verses (per-block RTL applied on Urdu, LTR for Hindi/English) */}
          <div
            dir={isUrdu ? 'rtl' : 'ltr'}
            className={`poem-body my-8 text-parchment leading-loose ${
              isUrdu
                ? 'font-urdu text-right text-2xl sm:text-3xl pr-6 border-r-2 border-gold/40'
                : 'font-devanagari text-xl sm:text-2xl pl-6 border-l-2 border-gold/40'
            }`}
          >
            {poem.body}
          </div>

          {/* Signature Divider */}
          <div className="ink-divider-ornate my-8" />
          <div className="flex items-center justify-between text-xs font-ui text-muted mb-8">
            <span className="italic">— suru_33 / सूरु शाइर</span>
            <span className="text-gold">❦ ❦ ❦</span>
          </div>

          {/* Clean Action Toolbar for Phase 1 */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-6 border-t border-gold/20">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full glass border transition-all text-xs font-ui ${
                liked ? 'border-rose text-rose bg-rose/15' : 'border-gold/30 text-cream/80 hover:text-parchment'
              }`}
            >
              <span>{liked ? '♥' : '♡'}</span>
              <span>{likes} पसंद</span>
            </button>

            <button
              onClick={handleFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-full glass border transition-all text-xs font-ui ${
                fav ? 'border-gold text-amber bg-gold/15' : 'border-gold/30 text-cream/80 hover:text-parchment'
              }`}
            >
              <span>{fav ? '★' : '☆'}</span>
              <span>{fav ? 'सहेजा गया' : 'सहेजें'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-full glass border border-gold/30 hover:border-gold text-cream hover:text-amber text-xs font-ui transition-all"
            >
              {copied ? '✓ कॉपी हुआ' : 'कॉपी करें'}
            </button>

            {typeof navigator !== 'undefined' && (navigator as any).share && (
              <button
                onClick={handleNativeShare}
                className="px-4 py-2 rounded-full glass border border-gold/30 hover:border-gold text-cream hover:text-amber text-xs font-ui transition-all"
              >
                शेयर करें
              </button>
            )}
          </div>

          {/* Tags */}
          {poem.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {poem.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs font-ui px-3 py-1 rounded-full bg-gold/5 border border-gold/20 text-muted"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related Poems */}
        {related.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gold/20">
              <h2 className="font-devanagari text-2xl font-bold text-parchment">
                अन्य संबंधित रचनाएँ
              </h2>
              <Link href="/category" className="text-xs font-ui text-amber hover:text-gold">
                सभी देखें &rarr;
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <PoemCard key={p._id} poem={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}