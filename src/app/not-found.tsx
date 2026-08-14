import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 sm:px-6 py-24 sm:py-32 text-center flex flex-col items-center">
      {/* 404 Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-amber text-xs font-ui uppercase tracking-widest mb-6 font-semibold">
        <span>✦</span>
        <span>404 · त्रुटि (Page Not Found)</span>
        <span>✦</span>
      </div>

      <h1 className="font-devanagari text-3xl sm:text-4xl md:text-5xl font-bold text-parchment mb-4 leading-tight">
        यह पन्ना डायरी में मौजूद नहीं है
      </h1>

      <p className="font-devanagari text-base sm:text-lg text-cream/85 leading-relaxed max-w-lg mb-8">
        शायद यह पन्ना अभी लिखा नहीं गया, या वक़्त की गर्द में कहीं खो गया है।
      </p>

      {/* Ornate Divider */}
      <div className="flex items-center justify-center gap-3 w-36 mb-8 opacity-70">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-gold" />
        <span className="text-gold text-xs">❦</span>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-gold" />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/" className="btn-primary text-xs">
          मुख्य पृष्ठ पर लौटें &rarr;
        </Link>
        <Link href="/category" className="btn-secondary text-xs">
          काव्य श्रेणियाँ देखें
        </Link>
      </div>
    </section>
  );
}
