import Link from "next/link";

const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/suru33_?igsh=NnNhb2o4M2w5a2Zs",
  facebook: "https://facebook.com/yourpage",
  youtube: "https://youtube.com/@yourchannel",
};

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/category", label: "Categories" },
  { href: "/search", label: "Search" },
  { href: "/favorites", label: "Favorites" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-accent">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="font-display text-accent-bright text-lg mb-2">
            Suru Shayar
          </p>
          <p className="text-sm text-muted leading-7">
            Every verse, kept in one place. A quiet corner for shayari and poems
            — love, longing, life, and everything in between.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-accent-bright mb-3">
            Quick Links
          </p>

          <div className="flex flex-col gap-2 text-sm text-muted">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-accent-bright transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-accent-bright mb-3">
            Follow
          </p>

          <div className="flex items-center gap-4">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted hover:text-accent-bright transition-colors"
            >
              Instagram
            </a>

            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-muted hover:text-accent-bright transition-colors"
            >
              Facebook
            </a>

            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-muted hover:text-accent-bright transition-colors"
            >
              YouTube
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-accent/40">
        <p className="text-center text-xs text-muted py-5">
          &copy; {new Date().getFullYear()} Suru Shayar. All rights reserved.
        </p>
      </div>
    </footer>
  );
}