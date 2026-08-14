'use client';

import { useState, useEffect } from 'react';

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
 * - with or without trailing slashes and query parameters (?igsh=..., ?utm_source=...)
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
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  const parsed = extractInstagramId(url);
  const isValid = Boolean(parsed);
  const shortcode = parsed?.id || '';
  const mediaType = parsed?.type || 'reel';

  // Direct embed endpoint per media type
  const embedSrc = `https://www.instagram.com/${mediaType}/${shortcode}/embed/captioned/`;
  const canonicalUrl = `https://www.instagram.com/${mediaType}/${shortcode}/`;

  // 6-second timeout fallback in case the iframe fails to load or is blocked
  useEffect(() => {
    if (!isValid) return;

    setLoaded(false);
    setTimedOut(false);

    const timer = setTimeout(() => {
      setLoaded((currentLoaded) => {
        if (!currentLoaded) {
          setTimedOut(true);
        }
        return currentLoaded;
      });
    }, 6000);

    return () => clearTimeout(timer);
  }, [url, isValid]);

  // Invalid URL Fallback
  if (!isValid) {
    return (
      <div className="glass-journal rounded-2xl p-6 text-center border border-rose/30 max-w-[420px] mx-auto my-4 shadow-card">
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

  return (
    <div className="relative w-full max-w-[420px] mx-auto my-4">
      {/* 9:16 Fixed Aspect Ratio Frame Container */}
      <div className="relative w-full h-[580px] sm:h-[640px] rounded-2xl overflow-hidden glass-journal border border-gold/30 shadow-card bg-black/70">
        {/* Loading Skeleton / Shimmer Placeholder */}
        {!loaded && !timedOut && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 skeleton-shimmer z-10">
            <div className="w-14 h-14 rounded-full bg-gold/15 border border-gold/35 flex items-center justify-center text-2xl mb-4 text-amber shadow-sm animate-pulse">
              🎬
            </div>
            <p className="text-xs font-ui text-amber uppercase tracking-wider mb-1 font-semibold">
              रील लोड हो रही है…
            </p>
            {title && (
              <p className="font-devanagari text-sm text-cream/90 text-center font-medium max-w-xs line-clamp-1 mt-1">
                {title}
              </p>
            )}
          </div>
        )}

        {/* 6-Second Timeout Fallback Screen */}
        {timedOut && !loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-black/90">
            <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-xl mb-3 text-gold">
              📸
            </div>
            <h3 className="font-devanagari text-base font-bold text-parchment mb-2">
              {title || 'काव्य रील'}
            </h3>
            <p className="font-devanagari text-xs text-cream/80 mb-6 max-w-xs leading-relaxed">
              रील को सीधे इंस्टाग्राम पर देखने के लिए नीचे दिए गए बटन पर क्लिक करें।
            </p>
            <div className="flex flex-col gap-2.5 w-full max-w-xs">
              <a
                href={canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs w-full text-center"
              >
                इंस्टाग्राम पर देखें ↗
              </a>
              <button
                onClick={() => {
                  setTimedOut(false);
                  setLoaded(false);
                }}
                className="btn-ghost text-xs w-full text-center"
              >
                पुनः प्रयास करें
              </button>
            </div>
          </div>
        )}

        {/* Direct Playable Instagram Iframe Embed */}
        <iframe
          src={embedSrc}
          title={title || `Instagram ${mediaType} ${shortcode}`}
          loading="lazy"
          className={`w-full h-full border-0 rounded-2xl transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          scrolling="no"
          onLoad={() => {
            setLoaded(true);
            setTimedOut(false);
          }}
        />
      </div>

      {/* External Direct Link */}
      <div className="text-center mt-2.5">
        <a
          href={canonicalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-ui text-muted hover:text-amber transition-colors inline-flex items-center gap-1.5 min-h-[32px] px-2"
        >
          <span>इंस्टाग्राम पर खोलें</span>
          <span>↗</span>
        </a>
      </div>
    </div>
  );
}
