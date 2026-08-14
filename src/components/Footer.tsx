import Link from 'next/link';

const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/suru33_?igsh=NnNhb2o4M2w5a2Zs',
  youtube: 'https://youtube.com/@suru...0123?si=6p5AgL-P44LxbjkB',
};

const QUICK_LINKS = [
  { href: '/', label: 'मुख्य पृष्ठ (Home)' },
  { href: '/category', label: 'श्रेणियाँ (Categories)' },
  { href: '/search', label: 'खोज (Search)' },
  { href: '/favorites', label: 'सहेजी गई रचनाएँ (Favorites)' },
  { href: '/contact', label: 'शायर परिचय (About Poet)' },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gold/25 glass relative z-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand Crest & Poetic Tagline */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="font-ui text-base font-bold text-parchment">
              suru_33
            </span>
            <span className="text-muted text-xs">/</span>
            <span className="font-devanagari text-lg font-bold text-parchment">
              सूरु शाइर
            </span>
          </div>

          <p className="font-devanagari text-sm text-cream/80 leading-relaxed mb-4">
            हर लफ़्ज़ में एक दास्ताँ, हर शेर में एक राज़ है। यह डिजिटल डायरी उन अनकहे जज़्बातों का ठिकाना है।
          </p>

          <p className="font-ui text-xs text-muted">
            By Suraj Lokewar (suru_33)
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <p className="font-ui text-xs uppercase tracking-widest text-amber font-semibold mb-4">
            नेविगेशन (Navigation)
          </p>

          <div className="flex flex-col gap-2.5 text-xs font-ui text-cream/70">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-amber transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Follow / Social links */}
        <div>
          <p className="font-ui text-xs uppercase tracking-widest text-amber font-semibold mb-4">
            सोशल मीडिया (Connect)
          </p>

          <div className="flex flex-col gap-3">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-xs font-ui text-cream/80 hover:text-amber transition-colors"
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
              className="flex items-center gap-2.5 text-xs font-ui text-cream/80 hover:text-amber transition-colors"
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
              <span>YouTube Channel</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-gold/15 py-5 text-center">
        <p className="font-ui text-xs text-muted">
          &copy; {new Date().getFullYear()} <span className="text-parchment">suru_33 / सूरु शाइर</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}