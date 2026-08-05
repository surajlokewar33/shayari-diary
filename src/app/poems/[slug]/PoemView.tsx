'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Poem, readingTime } from '@/lib/types';
import { isFavorite, toggleFavorite, hasLiked, setLiked } from '@/lib/favorites';
import { shareOrDownloadImage } from '@/lib/shareImage';
import AmbientCanvas from '@/components/AmbientCanvas';
import PoemCard from '@/components/PoemCard';

const langFont: Record<string, string> = {
  Urdu: 'font-urdu text-right leading-loose',
  Hindi: 'font-devanagari',
  English: '',
};

function getYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/);
  return match ? match[1] : null;
}

function isYouTubeShorts(url: string): boolean {
  return /youtube\.com\/shorts\//.test(url);
}

function isInstagramUrl(url: string): boolean {
  return /instagram\.com\/(reel|p|tv)\//.test(url);
}

function InstagramEmbed({ url }: { url: string }) {
  useEffect(() => {
    const existing = document.getElementById('instagram-embed-script');
    if (!existing) {
      const script = document.createElement('script');
      script.id = 'instagram-embed-script';
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    } else if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
  }, [url]);

  return (
    <div className="flex justify-center my-8">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ background: '#000', border: 0, borderRadius: '12px', margin: 0, maxWidth: '540px', width: '100%' }}
      />
    </div>
  );
}

function InkRevealBody({ body, language }: { body: string; language: string }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const lines = useMemo(() => body.split('\n'), [body]);
  const totalDuration = Math.min(lines.length * 0.16, 2.4);

  if (reducedMotion) {
    return (
      <div className={`poem-body font-display text-lg md:text-xl text-parchment/95 mb-10 whitespace-pre-line ${langFont[language]}`}>
        {body}
      </div>
    );
  }

  return (
    <div className={`relative mb-10 ${langFont[language] === 'font-urdu text-right leading-loose' ? 'pr-5' : 'pl-5'}`}>
      <motion.div
        initial={{ scaleY: 0, opacity: 0.6 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: totalDuration, ease: 'easeInOut' }}
        style={{ transformOrigin: 'top' }}
        className={`absolute top-1 bottom-1 w-[2px] bg-gradient-to-b from-accent via-accent-bright to-accent/20 ${
          langFont[language] === 'font-urdu text-right leading-loose' ? 'right-0' : 'left-0'
        }`}
      />
      <div className={`poem-body font-display text-lg md:text-xl text-parchment/95 ${langFont[language]}`}>
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: Math.min(i * 0.16, 2.2), ease: [0.16, 1, 0.3, 1] }}
          >
            {line || '\u00A0'}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function PoemView({ poem, related }: { poem: Poem; related: Poem[] }) {
  const [likes, setLikes] = useState(poem.likes);
  const [liked, setLikedState] = useState(hasLiked(poem._id));
  const [fav, setFav] = useState(isFavorite(poem._id));
  const [copied, setCopied] = useState(false);
  const [comments, setComments] = useState(poem.comments || []);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);

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
    await navigator.clipboard.writeText(`${poem.title}\n\n${poem.body}\n\n— ${poem.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([`${poem.title}\n\n${poem.body}\n\n— ${poem.author}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${poem.slug}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleWhatsApp() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const msg = encodeURIComponent(`"${poem.title}"\n\n${poem.body.slice(0, 200)}...\n\nRead more: ${url}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }

  async function handleShareImage() {
    setGeneratingImage(true);
    try {
      await shareOrDownloadImage(poem);
    } catch (err) {
      console.error('Share image failed', err);
    } finally {
      setGeneratingImage(false);
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/poems/${poem._id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, text }),
      });
      const data = await res.json();
      if (data.comments) {
        setComments(data.comments);
        setText('');
      }
    } finally {
      setPosting(false);
    }
  }

  const ytId = poem.videoUrl ? getYouTubeVideoId(poem.videoUrl) : null;
  const isInsta = poem.videoUrl ? isInstagramUrl(poem.videoUrl) : false;

  return (
    <article className="relative">
      <div className="relative overflow-hidden">
        <AmbientCanvas mode={poem.ambience} />

        <div className="relative z-10 mx-auto max-w-3xl px-5 md:px-8 pt-16 pb-10">
          <div className="flex items-center gap-3 text-xs font-mono text-muted mb-6">
            <Link href={`/category/${encodeURIComponent(poem.category)}`} className="text-accent hover:text-accent-bright">
              {poem.category}
            </Link>
            <span>·</span>
            <span>{readingTime(poem.body)}</span>
            <span>·</span>
            <span>{poem.views} views</span>
          </div>

          <h1 className={`font-display text-3xl md:text-5xl text-accent-bright mb-4 ${langFont[poem.language]}`}>
            {poem.title}
          </h1>
          <p className="text-sm text-muted mb-8">
            by {poem.author} · {new Date(poem.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          {poem.videoUrl && (
            <div className="mb-10">
              {isInsta ? (
                <InstagramEmbed url={poem.videoUrl} />
              ) : ytId ? (
                <div
                  className={`mx-auto rounded-3xl overflow-hidden glass p-2 shadow-glow ${
                    isYouTubeShorts(poem.videoUrl) ? 'max-w-sm' : 'max-w-2xl'
                  }`}
                >
                  <div
                    className={`rounded-2xl overflow-hidden bg-black ${
                      isYouTubeShorts(poem.videoUrl) ? 'aspect-[9/16]' : 'aspect-video'
                    }`}
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={poem.title}
                    />
                  </div>
                </div>
              ) : (
                <div className="mx-auto max-w-xl rounded-3xl overflow-hidden glass p-2 shadow-glow">
                  <video
                    src={poem.videoUrl}
                    controls
                    playsInline
                    className="w-full rounded-2xl"
                  />
                </div>
              )}
            </div>
          )}

          {poem.audioUrl && (
            <audio controls src={poem.audioUrl} className="w-full mb-8 rounded-lg" />
          )}

          <InkRevealBody body={poem.body} language={poem.language} />

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleLike} className={`glass glow-hover rounded-full px-4 py-2 text-sm ${liked ? 'text-rose' : 'text-muted'}`}>
              {liked ? '♥' : '♡'} {likes}
            </button>
            <button onClick={handleFavorite} className={`glass glow-hover rounded-full px-4 py-2 text-sm ${fav ? 'text-accent-bright' : 'text-muted'}`}>
              {fav ? '★ Saved' : '☆ Save'}
            </button>
            <button onClick={handleCopy} className="glass glow-hover rounded-full px-4 py-2 text-sm text-muted">
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
            <button onClick={handleDownload} className="glass glow-hover rounded-full px-4 py-2 text-sm text-muted">
              Download
            </button>
            <button onClick={handleWhatsApp} className="glass glow-hover rounded-full px-4 py-2 text-sm text-muted">
              Share
            </button>
            <button
              onClick={handleShareImage}
              disabled={generatingImage}
              className="glass glow-hover rounded-full px-4 py-2 text-sm text-muted disabled:opacity-50"
            >
              {generatingImage ? 'Creating…' : '🖼 Share Image'}
            </button>
          </div>

          {poem.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {poem.tags.map((t) => (
                <span key={t} className="text-[11px] font-mono px-3 py-1 rounded-full border border-accent text-muted">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="mx-auto max-w-3xl px-5 md:px-8 py-10">
        <div className="ink-divider mb-8" />
        <h2 className="font-display text-xl text-accent-bright mb-6">Comments ({comments.length})</h2>

        <form onSubmit={handleComment} className="glass rounded-2xl p-5 mb-8 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full bg-transparent border border-accent rounded-lg px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:border-accent-bright"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share what this poem made you feel..."
            rows={3}
            required
            className="w-full bg-transparent border border-accent rounded-lg px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:border-accent-bright"
          />
          <button
            type="submit"
            disabled={posting}
            className="text-sm px-4 py-2 rounded-full bg-accent/20 border border-accent text-accent-bright hover:bg-accent/30 transition-colors disabled:opacity-50"
          >
            {posting ? 'Posting…' : 'Post comment'}
          </button>
        </form>

        <div className="space-y-4">
          {comments.length === 0 && <p className="text-muted text-sm">No comments yet — be the first to leave one.</p>}
          {comments.map((c, i) => (
            <div key={c._id || i} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-accent-bright font-medium">{c.name || 'Anonymous'}</span>
                {c.createdAt && (
                  <span className="text-[11px] text-muted font-mono">{new Date(c.createdAt).toLocaleDateString()}</span>
                )}
              </div>
              <p className="text-sm text-parchment/90">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 md:px-8 py-10">
          <div className="ink-divider mb-8" />
          <h2 className="font-display text-xl text-accent-bright mb-6">Related poems</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <PoemCard key={p._id} poem={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}