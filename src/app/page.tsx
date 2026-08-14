import Link from 'next/link';
import { dbConnect } from '@/lib/mongodb';
import Poem from '@/lib/models/Poem';
import PoemCard from '@/components/PoemCard';
import HeroBanner from '@/components/HeroBanner';
import CoupletCard from '@/components/CoupletCard';
import { CATEGORIES, CATEGORY_LABELS } from '@/lib/types';

export const revalidate = 0;

const CATEGORY_ICONS: Record<string, string> = {
  'Urdu Shayari': '🖋️',
  'Hindi Poems': '📜',
  'Ghazal': '🌙',
  'Nazm': '🎋',
  'Sher': '✒️',
  'Video': '🎬',
  'Others': '📖',
};

async function getData() {
  try {
    await dbConnect();
    const now = new Date();
    const publishedFilter = { published: true, $or: [{ scheduledAt: null }, { scheduledAt: { $lte: now } }] };

    const [featured, latest, counts] = await Promise.all([
      Poem.findOne({ ...publishedFilter, featured: true }).sort({ createdAt: -1 }).lean(),
      Poem.find(publishedFilter).sort({ createdAt: -1 }).limit(6).lean(),
      Poem.aggregate([
        { $match: { published: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
    ]);

    const countMap: Record<string, number> = {};
    counts.forEach((c) => (countMap[c._id] = c.count));

    const featuredOrFallback = featured || latest[0] || null;

    return {
      featured: JSON.parse(JSON.stringify(featuredOrFallback)),
      latest: JSON.parse(JSON.stringify(latest)),
      countMap,
    };
  } catch (err) {
    console.error('Database connection error in HomePage:', err);
    return { featured: null, latest: [], countMap: {} };
  }
}

export default async function HomePage() {
  const { featured, latest, countMap } = await getData();

  // Extract shers from poems for couplet of the moment if available
  const dynamicShers = latest
    .filter((p: any) => p.body && p.body.length > 20)
    .map((p: any) => ({
      sher: p.body.split('\n').filter(Boolean).slice(0, 2).join('\n'),
      author: p.author || 'सूरु शाइर',
      tag: p.category,
    }));

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* 1. Atmospheric Illustrated Hero Banner */}
      <HeroBanner />

      {/* 2. Couplet of the Moment (Rotating Quote Card) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <CoupletCard customShers={dynamicShers.length > 0 ? dynamicShers : undefined} />
      </section>

      {/* 3. Category Filter Chips with Icons */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-3">
        <div className="flex flex-col items-center mb-5 text-center">
          <p className="font-ui text-xs uppercase tracking-widest text-gold mb-1">
            श्रेणियों के अनुसार पढ़ें
          </p>
          <h2 className="font-devanagari text-2xl font-bold text-parchment">
            काव्य विधाएँ
          </h2>
        </div>

        <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center">
          {CATEGORIES.map((c) => {
            const count = countMap[c] || 0;
            const icon = CATEGORY_ICONS[c] || '✒️';
            const label = CATEGORY_LABELS[c] || c;

            return (
              <Link
                key={c}
                href={`/category/${encodeURIComponent(c)}`}
                className="group flex items-center gap-2 px-4 py-2 rounded-full glass-journal border border-gold/25 hover:border-gold text-parchment hover:text-amber transition-all text-xs font-ui glow-hover"
              >
                <span>{icon}</span>
                <span className="font-devanagari font-medium text-sm">{label}</span>
                {count > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold/15 text-amber">
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Shayari of the Day */}
      {featured && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-4">
          <div className="relative rounded-3xl overflow-hidden glass-journal border border-gold/35 p-8 sm:p-12 md:p-14 shadow-journal glow-hover">
            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="px-3 py-1 rounded-full bg-gold/20 border border-gold/35 text-amber text-xs font-ui uppercase tracking-wider">
                  ★ आज की खास रचना
                </span>
                <span className="text-xs font-ui text-muted">
                  {featured.category}
                </span>
              </div>

              <h2 className="font-devanagari text-3xl sm:text-4xl md:text-5xl font-bold text-parchment mb-5 leading-tight">
                {featured.title}
              </h2>

              <p className="font-devanagari text-lg sm:text-xl text-cream/90 leading-loose whitespace-pre-line mb-6 max-w-2xl">
                {featured.body.split('\n').filter(Boolean).slice(0, 4).join('\n')}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-gold/20">
                <p className="text-xs sm:text-sm text-amber font-ui flex items-center gap-2">
                  <span>✍️ रचयिता:</span>
                  <span className="font-semibold">{featured.author || 'सुरज लोकेवार (suru_33)'}</span>
                </p>

                <Link
                  href={`/poems/${featured.slug}`}
                  className="px-5 py-2.5 rounded-full bg-gold/20 hover:bg-gold/30 border border-gold text-amber font-ui text-xs uppercase tracking-wider transition-all"
                >
                  पूरी रचना पढ़ें &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Latest Poems Grid */}
      <section id="latest-poems" className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-8">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-gold/20">
          <div>
            <p className="font-ui text-xs uppercase tracking-widest text-gold mb-1">
              डायरी के ताज़ा पन्ने
            </p>
            <h2 className="font-devanagari text-3xl sm:text-4xl font-bold text-parchment">
              नई शायरियाँ और नज़्में
            </h2>
          </div>

          <Link
            href="/category"
            className="flex items-center gap-1.5 text-xs sm:text-sm text-amber hover:text-gold font-ui uppercase tracking-wider transition-colors pb-1"
          >
            <span>सभी रचनाएँ</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {latest.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {latest.map((p: any) => (
              <PoemCard key={p._id} poem={p} />
            ))}
          </div>
        ) : (
          <div className="glass-journal rounded-3xl p-12 text-center text-muted border border-gold/20">
            <p className="font-devanagari text-lg mb-2">डायरी में अभी कोई शायरी प्रकाशित नहीं है।</p>
            <p className="text-xs font-ui">एडमिन डैशबोर्ड से अपनी पहली रचना जोड़ें।</p>
          </div>
        )}
      </section>

      {/* 6. The Poet / About Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-10">
        <div className="glass-journal rounded-3xl p-8 sm:p-10 border border-gold/25 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-10">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gold shrink-0 shadow-glow relative">
            <img
              src="/profile.jpeg"
              alt="Suraj Lokewar (suru_33)"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="inline-block text-[11px] font-ui uppercase tracking-widest text-gold px-3 py-1 rounded-full bg-gold/10 border border-gold/25 mb-2.5">
              शायर का परिचय
            </div>
            <h3 className="font-devanagari text-2xl sm:text-3xl font-bold text-parchment mb-2">
              सुरज लोकेवार <span className="text-amber font-ui text-lg">(suru_33)</span>
            </h3>
            <p className="font-devanagari text-base sm:text-lg text-cream leading-relaxed mb-4">
              हर शब्द एक एहसास है, हर शेर एक कहानी। यह डायरी उन अनकहे जज़्बातों का ठिकाना है जो अक्सर ख़ामोशी में गूंजते हैं।
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 text-xs font-ui">
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-full bg-gold/15 hover:bg-gold/25 border border-gold/40 text-amber transition-all"
              >
                पूरा परिचय एवं संपर्क &rarr;
              </Link>
              <a
                href="https://www.instagram.com/suru33_?igsh=NnNhb2o4M2w5a2Zs"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full glass border border-gold/25 text-muted hover:text-parchment transition-all"
              >
                Instagram (@suru33_) ↗
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}