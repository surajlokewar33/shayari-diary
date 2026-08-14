import Link from 'next/link';
import { dbConnect } from '@/lib/mongodb';
import Poem from '@/lib/models/Poem';
import { CATEGORIES, CATEGORY_LABELS } from '@/lib/types';

export const revalidate = 0;

const CATEGORY_META: Record<
  string,
  { icon: string; description: string; tag: string }
> = {
  'Urdu Shayari': {
    icon: '🖋️',
    description: 'रूहानी अल्फ़ाज़ और गहराइयों से भरी उर्दू शायरी के नायाब शेर।',
    tag: 'उर्दू क्लासिक',
  },
  'Hindi Poems': {
    icon: '📜',
    description: 'जीवन, संवेदना और प्रेम के विविध रंगों को समेटे हिंदी कविताएँ।',
    tag: 'काव्य धारा',
  },
  'Ghazal': {
    icon: '🌙',
    description: 'काफ़िया और रदीफ़ के सांचे में ढली दिल को छू लेने वाली ग़ज़लें।',
    tag: 'मखमली नग़मे',
  },
  'Nazm': {
    icon: '🎋',
    description: 'मुक्त भाव से बहती हुई कहानी जैसी असरदार नज़्में।',
    tag: 'आज़ाद ख्याल',
  },
  'Sher': {
    icon: '✒️',
    description: 'दो पंक्तियों में ज़िंदगी का पूरा फ़लसफ़ा समेटे चुनिंदा शेर।',
    tag: 'मुकम्मल मिसरे',
  },
  'Video': {
    icon: '🎬',
    description: 'स्वरचित शायरी और कविता पाठ के भावपूर्ण वीडियो एवं रील्स।',
    tag: 'दृश्य काव्य',
  },
  'Others': {
    icon: '📖',
    description: 'डायरी के फुटकर विचार, गद्य रचनाएँ और मुक्त चिंतन।',
    tag: 'विविध संग्रह',
  },
};

export default async function CategoryIndexPage() {
  try {
    await dbConnect();
    const counts = await Poem.aggregate([
      { $match: { published: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const countMap: Record<string, number> = {};
    counts.forEach((c) => (countMap[c._id] = c.count));

    return (
      <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-amber text-xs font-ui uppercase tracking-widest mb-4 font-semibold">
            <span>✦</span>
            <span>काव्य श्रेणियाँ · Genres</span>
            <span>✦</span>
          </div>

          <h1 className="font-devanagari text-4xl sm:text-5xl font-bold text-parchment mb-4">
            काव्य विधाओं का संग्रह
          </h1>

          <p className="font-devanagari text-base sm:text-lg text-cream leading-relaxed">
            अपने मिज़ाज और जज़्बात के अनुसार शायरी, ग़ज़ल या नज़्म का चुनाव करें।
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CATEGORIES.map((c) => {
            const meta = CATEGORY_META[c] || { icon: '📖', description: 'काव्य रचनाएँ', tag: 'विधा' };
            const label = CATEGORY_LABELS[c] || c;
            const count = countMap[c] || 0;

            return (
              <Link
                key={c}
                href={`/category/${encodeURIComponent(c)}`}
                className="glass-journal glow-hover group rounded-3xl p-7 border border-gold/25 flex flex-col justify-between relative overflow-hidden min-h-[250px]"
              >
                {/* Decorative corner */}
                <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-gold/30 rounded-tr-md pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-13 h-13 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-2xl group-hover:scale-105 group-hover:border-gold transition-all shadow-sm">
                      {meta.icon}
                    </div>

                    <span className="text-xs font-ui px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-amber font-medium">
                      {count} रचनाएँ
                    </span>
                  </div>

                  <span className="text-[11px] font-ui uppercase tracking-wider text-muted block mb-1 font-medium">
                    {meta.tag}
                  </span>

                  <h2 className="font-devanagari text-2xl font-bold text-parchment group-hover:text-amber transition-colors mb-3">
                    {label}
                  </h2>

                  <p className="font-devanagari text-sm sm:text-base text-cream/80 leading-relaxed">
                    {meta.description}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-gold/15 flex items-center justify-between text-xs font-ui text-amber group-hover:text-gold transition-colors font-medium">
                  <span>पन्ने पलटें</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    );
  } catch (err) {
    console.error('Error fetching category counts:', err);
    return (
      <section className="mx-auto max-w-6xl px-5 md:px-8 py-16 text-center text-muted">
        श्रेणियाँ लोड करने में समस्या हुई। कृपया पुनः प्रयास करें।
      </section>
    );
  }
}