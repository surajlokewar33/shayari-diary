'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Poem, readingTime, CATEGORY_LABELS } from '@/lib/types';
import { isFavorite, toggleFavorite, hasLiked, setLiked } from '@/lib/favorites';
import AmbientCanvas from '@/components/AmbientCanvas';
import PoemCard from '@/components/PoemCard';
import InstagramEmbed from '@/components/InstagramEmbed';

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function PoemView({ poem, related }: { poem: Poem; related: Poem[] }) {
  const [likes, setLikes] = useState(poem.likes);
  const [liked, setLikedState] = useState(hasLiked(poem._id));
  const [fav, setFav] = useState(isFavorite(poem._id));
  const [copied, setCopied] = useState(false);

  const isUrdu = poem.language === 'Urdu';
  const categoryLabel = CATEGORY_LABELS[poem.category as keyof typeof CATEGORY_LABELS] ?? poem.category;
  const ytEmbedUrl = poem.videoUrl ? getYouTubeEmbedUrl(poem.videoUrl) : null;
  const isInstagram = poem.videoUrl?.includes('instagram.com');

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
    <article className="relative min-h-screen py-8 md:py-16">
      {/* Background Ambience Animation */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <AmbientCanvas mode={poem.ambience} />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
        {/* Main Journal Page Card */}
        <div className="glass-journal rounded-3xl p-6 sm:p-10 md:p-14 border border-gold/35 shadow-card relative overflow-hidden">
          {/* Decorative watermark quote mark */}
          <div className="absolute top-6 right-8 text-8xl sm:text-9xl font-serif text-gold/5 pointer-events-none select-none">
            ❝
          </div>

          {/* Ornate Corner Flourishes */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gold/40 rounded-tl-md pointer-events-none" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gold/40 rounded-tr-md pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gold/40 rounded-bl-md pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gold/40 rounded-br-md pointer-events-none" />

          {/* Breadcrumb / Category Metadata (stays LTR) */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-ui text-muted mb-8 pb-4 border-b border-gold/15">
            <div className="flex items-center gap-2.5">
              <Link
                href={`/category/${encodeURIComponent(poem.category)}`}
                className="px-3.5 py-1 rounded-full bg-gold/15 border border-gold/30 text-amber hover:bg-gold/25 transition-colors font-medium min-h-[32px] flex items-center"
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

          {/* Poem Title */}
          <h1
            dir={isUrdu ? 'rtl' : 'ltr'}
            className={`font-bold text-3xl sm:text-4xl md:text-5xl text-parchment mb-4 drop-shadow-sm leading-tight ${
              isUrdu ? 'font-devanagari text-right' : 'font-devanagari'
            }`}
          >
            {poem.title}
          </h1>

          <p className="text-sm font-ui text-amber flex items-center gap-2 mb-8 font-medium">
            <span>✍️</span>
            <span>{poem.author || 'सुरज लोकेवार (suru_33)'}</span>
          </p>

          {/* The Poem Verses (constrained to max-w-2xl for optimal reading length) */}
          <div
            dir={isUrdu ? 'rtl' : 'ltr'}
            className={`poem-body my-10 text-parchment leading-[2.3] max-w-2xl ${
              isUrdu
                ? 'font-devanagari text-right text-xl sm:text-2xl pr-6 border-r-2 border-gold/40'
                : 'font-devanagari text-xl sm:text-2xl pl-6 border-l-2 border-gold/40'
            }`}
          >
            {poem.body}
          </div>

          {/* Optional Video / Instagram Reel Embed */}
          {poem.videoUrl && (
            <div className="my-8">
              {isInstagram ? (
                <InstagramEmbed url={poem.videoUrl} title={poem.title} />
              ) : ytEmbedUrl ? (
                <div className="aspect-video rounded-2xl overflow-hidden border border-gold/30 shadow-card bg-black max-w-2xl mx-auto">
                  <iframe
                    src={ytEmbedUrl}
                    title={poem.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              ) : null}
            </div>
          )}

          {/* Signature Divider */}
          <div className="ink-divider-ornate my-8" />
          <div className="flex items-center justify-between text-xs font-ui text-muted mb-8">
            <span className="italic">— suru_33 / सूरु शाइर</span>
            <span className="text-gold">❦ ❦ ❦</span>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-gold/15">
            <button
              onClick={handleLike}
              className={`btn-ghost text-xs font-ui gap-2 min-h-[44px] ${
                liked ? 'border-rose text-rose bg-rose/15' : ''
              }`}
            >
              <span>{liked ? '♥' : '♡'}</span>
              <span>{likes} पसंद</span>
            </button>

            <button
              onClick={handleFavorite}
              className={`btn-ghost text-xs font-ui gap-2 min-h-[44px] ${
                fav ? 'border-gold text-amber bg-gold/15' : ''
              }`}
            >
              <span>{fav ? '★' : '☆'}</span>
              <span>{fav ? 'सहेजा गया' : 'सहेजें'}</span>
            </button>

            <button
              onClick={handleCopy}
              aria-live="polite"
              className={`text-xs font-ui min-h-[44px] px-4 transition-all ${
                copied
                  ? 'btn-secondary border-gold text-amber bg-gold/20 shadow-sm'
                  : 'btn-ghost'
              }`}
            >
              {copied ? '✓ कॉपी हुआ' : 'कॉपी करें'}
            </button>

            {typeof navigator !== 'undefined' && (navigator as any).share && (
              <button
                onClick={handleNativeShare}
                className="btn-ghost text-xs font-ui min-h-[44px]"
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
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gold/20">
              <h2 className="font-devanagari text-2xl font-bold text-parchment">
                अन्य संबंधित रचनाएँ
              </h2>
              <Link href="/category" className="text-xs font-ui text-amber hover:text-gold min-h-[44px] flex items-center">
                सभी देखें &rarr;
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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