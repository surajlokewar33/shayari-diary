import Link from 'next/link';

const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/suru33_?igsh=NnNhb2o4M2w5a2Zs',
  youtube: 'https://youtube.com/@suru...0123?si=6p5AgL-P44LxbjkB',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8 py-12 md:py-20">
      <div className="glass-journal rounded-3xl p-8 sm:p-12 md:p-14 border border-gold/35 text-center relative overflow-hidden shadow-journal">
        {/* Subtle corner ornaments */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gold/40 rounded-tl-md pointer-events-none" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gold/40 rounded-tr-md pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gold/40 rounded-bl-md pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gold/40 rounded-br-md pointer-events-none" />

        {/* Profile Avatar */}
        <div className="relative inline-block mb-6">
          <img
            src="/profile.jpeg"
            alt="सुरज लोकेवार (suru_33)"
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover mx-auto border-2 border-gold shadow-glow"
          />
          <div className="absolute bottom-1 right-2 w-6 h-6 rounded-full bg-gold text-ink text-xs font-bold flex items-center justify-center border-2 border-ink">
            ✍️
          </div>
        </div>

        {/* Poet Name & Handle */}
        <h1 className="font-devanagari text-3xl sm:text-4xl md:text-5xl font-bold text-parchment mb-2">
          सुरज लोकेवार
        </h1>
        <p className="text-amber font-ui text-sm sm:text-base font-semibold tracking-wider uppercase mb-6">
          suru_33 · शाइर एवं लेखक
        </p>

        {/* Bio */}
        <p className="font-devanagari text-base sm:text-lg text-cream leading-loose max-w-xl mx-auto mb-8">
          हर शब्द एक एहसास है, हर शेर एक कहानी। अगर मेरी पंक्तियाँ आपके दिल तक पहुँची हैं, तो जुड़िए, अपनी राय दीजिए और इस अदबी सफ़र का हिस्सा बनिए।
        </p>

        <div className="ink-divider-ornate my-8" />

        {/* Social Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex items-center gap-2.5 text-xs sm:text-sm text-parchment hover:text-amber transition-all font-ui px-5 py-2.5 rounded-full glass border border-gold/30 glow-hover"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="w-4 h-4 text-gold"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>Instagram (@suru33_)</span>
          </a>

          <a
            href={SOCIAL_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="flex items-center gap-2.5 text-xs sm:text-sm text-parchment hover:text-amber transition-all font-ui px-5 py-2.5 rounded-full glass border border-gold/30 glow-hover"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="w-4 h-4 text-rose"
            >
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
            </svg>
            <span>YouTube चैनल</span>
          </a>
        </div>
      </div>
    </div>
  );
}