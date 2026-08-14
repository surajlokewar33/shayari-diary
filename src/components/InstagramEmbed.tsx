'use client';

import { useState } from 'react';

interface InstagramEmbedProps {
  url: string;
  title?: string;
}

/**
 * Extracts the Instagram shortcode and media type from any valid Instagram URL.
 * Handles:
 * - /reel/CODE
 * - /reels/CODE
 * - /p/CODE
 * - /tv/CODE
 * - /username/reel/CODE (e.g. /suru33_/reel/DYRuliXocoO/)
 * - /username/reels/CODE
 * - /username/p/CODE
 * - /share/reel/CODE
 * - with or without trailing slashes and query params (?igsh=..., ?utm_source=...)
 */
export function extractInstagramId(url: string): { id: string; type: 'reel' | 'p' | 'tv' } | null {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();
  const match = trimmed.match(
    /(?:instagram\.com\/(?:[a-zA-Z0-9_.]+\/)?(?:reel|reels|p|tv|share\/reel|share\/p)\/|instagr\.am\/(?:p|reel)\/)([A-Za-z0-9_-]+)/i
  );

  if (match && match[1]) {
    const isReel = /reels?/i.test(match[0]);
    const isTv = /tv/i.test(match[0]);
    return {
      id: match[1],
      type: isTv ? 'tv' : isReel ? 'reel' : 'p',
    };
  }

  return null;
}

export default function InstagramEmbed({ url, title }: InstagramEmbedProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const parsed = extractInstagramId(url);
  const isValid = Boolean(parsed);
  const shortcode = parsed?.id || '';
  const mediaType = parsed?.type || 'reel';

  if (!isValid) {
    return (
      <div className="glass-journal rounded-2xl p-6 text-center border border-rose/30 max-w-[540px] mx-auto my-4 shadow-card">
        <div className="text-2xl mb-2 text-rose">⚠️</div>
        <p className="font-devanagari text-sm text-parchment mb-2 font-semibold">
          मान्य इंस्टाग्राम लिंक नहीं है
        </p>
        <p className="font-ui text-xs text-muted mb-4 truncate max-w-full px-4">
          {url || 'कोई लिंक प्रदान नहीं किया गया'}
        </p>
        <div className="text-[11px] font-ui text-cream/70 mb-4">
          कृपया <code className="text-amber bg-black/40 px-1.5 py-0.5 rounded">https://www.instagram.com/reel/...</code> जैसा लिंक दर्ज करें।
        </div>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs"
          >
            Instagram पर खोलें ↗
          </a>
        )}
      </div>
    );
  }

  // Official Instagram embed player endpoint
  const embedSrc = `https://www.instagram.com/${mediaType}/${shortcode}/embed/captioned/`;
  const canonicalUrl = `https://www.instagram.com/${mediaType}/${shortcode}/`;

  return (
    <div className="relative w-full max-w-[540px] mx-auto my-4">
      {/* Loading Skeleton */}
      {!iframeLoaded && (
        <div className="w-full h-[540px] sm:h-[620px] rounded-2xl glass-journal border border-gold/25 flex flex-col items-center justify-center p-6 skeleton-shimmer">
          <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-xl mb-3 text-gold">
            📸
          </div>
          <p className="text-xs font-ui text-amber uppercase tracking-wider mb-1 font-semibold">
            Instagram Reel Loading…
          </p>
          {title && (
            <p className="font-devanagari text-sm text-cream text-center font-medium max-w-xs line-clamp-1">
              {title}
            </p>
          )}
        </div>
      )}

      {/* Responsive Instagram Player Frame */}
      <div
        className={`w-full overflow-hidden rounded-2xl border border-gold/30 shadow-card bg-black/60 transition-opacity duration-300 ${
          iframeLoaded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
        }`}
      >
        <iframe
          src={embedSrc}
          title={title || `Instagram ${mediaType} ${shortcode}`}
          className="w-full h-[540px] sm:h-[620px] border-0 rounded-2xl"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          scrolling="no"
          onLoad={() => setIframeLoaded(true)}
        />
      </div>

      {/* Fallback Direct Link */}
      <div className="text-center mt-2">
        <a
          href={canonicalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-ui text-muted hover:text-amber transition-colors inline-flex items-center gap-1"
        >
          <span>Instagram पर रील देखें</span>
          <span>↗</span>
        </a>
      </div>
    </div>
  );
}
