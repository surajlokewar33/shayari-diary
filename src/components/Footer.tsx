import Link from 'next/link';

const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/suru33_?igsh=NnNhb2o4M2w5a2Zs',
  youtube: 'https://youtube.com/@suru...0123?si=6p5AgL-P44LxbjkB',
};

const QUICK_LINKS = [
  { href: '/', label: 'मुख्य पृष्ठ (Home)' },
  { href: '/category', label: 'श्रेणियाँ (Categories)' },
  { href: '/reels', label: 'काव्य रील्स (Reels)' },
  { href: '/search', label: 'खोज (Search)' },
  { href: '/favorites', label: 'सहेजी गई रचनाएँ (Favorites)' },
  { href: '/contact', label: 'शायर परिचय (About Poet)' },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gold/25 bg-maroon/80 backdrop-blur-lg relative z-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-14 sm:py-16 grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="font-devanagari text-2xl font-bold text-parchment">
              मुरीद शाइर
            </span>
          </div>

          <p className="font-devanagari text-sm text-cream/85 leading-relaxed">
            हर लफ़्ज़ में एक दास्ताँ, हर शेर में एक राज़ है। यह डिजिटल डायरी उन अनकहे जज़्बातों का ठिकाना है।
          </p>

          <p className="font-ui text-xs text-muted tracking-wide">
            By Suraj Lokewar (मुरीद शाइर)
          </p>
        </div>

        {/* Quick Navigation Links */}
        <div>
          <p className="font-ui text-xs uppercase tracking-widest text-amber font-semibold mb-5">
            नेविगेशन (Navigation)
          </p>

          <div className="flex flex-col gap-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-ui text-cream/75 hover:text-amber transition-colors py-1 min-h-[36px] flex items-center"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Follow / Connect */}
        <div>
          <p className="font-ui text-xs uppercase tracking-widest text-amber font-semibold mb-5">
            सोशल मीडिया (Connect)
          </p>

          <div className="flex flex-col gap-3">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm font-ui text-cream/85 hover:text-amber transition-colors p-2.5 rounded-2xl glass border border-gold/20 glow-hover min-h-[44px]"
              aria-label="Instagram Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-5 h-5 text-gold shrink-0"
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
              className="flex items-center gap-3 text-sm font-ui text-cream/85 hover:text-amber transition-colors p-2.5 rounded-2xl glass border border-gold/20 glow-hover min-h-[44px]"
              aria-label="YouTube Channel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-5 h-5 text-rose shrink-0"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
              </svg>
              <span>YouTube Channel</span>
            </a>
          </div>
        </div>
      </div>

      {/* Distinct Bottom Copyright Strip */}
      <div className="border-t border-gold/15 py-6 text-center bg-black/30">
        <p className="font-ui text-xs text-muted">
          &copy; {new Date().getFullYear()} <span className="text-parchment font-medium font-devanagari">मुरीद शाइर</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}