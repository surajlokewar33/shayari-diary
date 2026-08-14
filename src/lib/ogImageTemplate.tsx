import { ImageResponse } from 'next/og';
import { dbConnect } from '@/lib/mongodb';
import Poem from '@/lib/models/Poem';

const COLORS = {
  inkTop: '#0B0F1A',
  inkBottom: '#0E1420',
  gold: '#C9A24B',
  goldBright: '#E4C878',
  parchment: '#F4EFE3',
  muted: '#8B93A7',
};

// Google Fonts serves woff2 by default, but Satori needs ttf/otf.
// Requesting with an older User-Agent string makes Google serve ttf instead.
const LEGACY_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';

async function loadGoogleFont(fontFamily: string, text: string): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      fontFamily
    )}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(cssUrl, { headers: { 'User-Agent': LEGACY_UA } })).text();
    const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/);
    if (!match) return null;
    const res = await fetch(match[1]);
    if (res.status !== 200) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? clean.slice(0, max).trim() + '…' : clean;
}

export async function buildOgImage(slug: string): Promise<ImageResponse> {
  await dbConnect();
  const poem = await Poem.findOne({ slug }).lean();

  if (!poem) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            background: COLORS.inkTop,
            color: COLORS.gold,
            fontSize: 48,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
             मुरीद शाइर
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const p: any = poem;
  const bodyPreview = truncate(p.body || '', 160);
  const brandText = 'मुरीद शाइर';
  const allDevanagariText = `${brandText}${p.language === 'Hindi' || p.language === 'Marathi' ? bodyPreview + p.title : ''}`;
  const allUrduText = p.language === 'Urdu' ? bodyPreview + p.title : '';

  const [devanagariFont, urduFont, displayFont] = await Promise.all([
    loadGoogleFont('Noto Sans Devanagari', allDevanagariText || brandText),
    allUrduText ? loadGoogleFont('Noto Nastaliq Urdu', allUrduText) : Promise.resolve(null),
    loadGoogleFont('Playfair Display', `${p.title}${bodyPreview}${p.author || ''}${p.category || ''}0123456789`),
  ]);

  const fonts: { name: string; data: ArrayBuffer; weight?: any; style?: any }[] = [];
  if (displayFont) fonts.push({ name: 'Playfair Display', data: displayFont, weight: 600 });
  if (devanagariFont) fonts.push({ name: 'Noto Sans Devanagari', data: devanagariFont, weight: 500 });
  if (urduFont) fonts.push({ name: 'Noto Nastaliq Urdu', data: urduFont, weight: 500 });

  const bodyFontFamily =
    p.language === 'Urdu' && urduFont
      ? 'Noto Nastaliq Urdu'
      : p.language === 'Hindi' && devanagariFont
      ? 'Noto Sans Devanagari'
      : 'Playfair Display';

  const isUrdu = p.language === 'Urdu';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: `linear-gradient(180deg, ${COLORS.inkTop} 0%, ${COLORS.inkBottom} 100%)`,
          padding: '56px 70px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: `1.5px solid rgba(201,162,75,0.35)`,
            borderRadius: 24,
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              letterSpacing: 4,
              color: COLORS.gold,
              fontFamily: 'Playfair Display',
              marginBottom: 20,
              textTransform: 'uppercase',
            }}
          >
            {p.category}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: isUrdu ? 52 : 56,
              color: COLORS.goldBright,
              fontFamily: bodyFontFamily,
              fontWeight: 600,
              marginBottom: 24,
              lineHeight: 1.25,
              maxWidth: 980,
              direction: isUrdu ? 'rtl' : 'ltr',
            }}
          >
            {truncate(p.title || '', 60)}
          </div>

          <div
            style={{
              display: 'flex',
              width: 90,
              height: 2,
              background: COLORS.gold,
              marginBottom: 28,
            }}
          />

          <div
            style={{
              display: 'flex',
              fontSize: 32,
              color: COLORS.parchment,
              fontFamily: bodyFontFamily,
              lineHeight: 1.5,
              maxWidth: 980,
              direction: isUrdu ? 'rtl' : 'ltr',
              textAlign: isUrdu ? 'right' : 'left',
            }}
          >
            {bodyPreview}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 24,
          }}
        >
          <div style={{ display: 'flex', fontSize: 24, color: COLORS.muted, fontFamily: 'Playfair Display' }}>
            — {p.author || 'Anonymous'}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              color: COLORS.gold,
              fontFamily: 'Noto Sans Devanagari',
              fontWeight: 600,
            }}
          >
            {brandText}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fonts.length > 0 ? fonts : undefined,
    }
  );
}