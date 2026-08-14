'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTheme, ThemeName } from './ThemeProvider';

const THEMES: { id: ThemeName; label: string }[] = [
  { id: 'ink', label: 'Dark' },
  { id: 'vintage', label: 'Vintage Paper' },
  { id: 'blackgold', label: 'Black & Gold' },
  { id: 'royal', label: 'Royal Blue' },
];

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/category', label: 'Categories' },
  { href: '/search', label: 'Search' },
  { href: '/favorites', label: 'Favorites' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto max-w-6xl px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="text-accent-bright shrink-0 transition-transform group-hover:rotate-6"
          >
            <path
              d="M4 20L15 9M15 9L18 6C18.5 5.5 19.5 5.5 20 6C20.5 6.5 20.5 7.5 20 8L17 11M15 9L17 11M4 20L6 15L11 17L4 20Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-display text-xl tracking-wide text-accent-bright">
            सूरु 33 <span className="text-muted text-sm font-body">· शाइर</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 font-body text-sm">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative pb-1 transition-colors ${
                  active ? 'text-accent-bright' : 'text-muted hover:text-accent-bright'
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-[1.5px] bg-accent-bright transition-all ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <button
              onClick={() => setThemeOpen((v) => !v)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-accent text-muted hover:text-accent-bright hover:border-accent-bright transition-colors"
            >
              {THEMES.find((t) => t.id === theme)?.label}
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className={`transition-transform ${themeOpen ? 'rotate-180' : ''}`}>
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            {themeOpen && (
              <div className="absolute right-0 mt-2 w-44 glass rounded-lg overflow-hidden shadow-lg border border-accent/30">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setTheme(t.id); setThemeOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${
                      theme === t.id ? 'text-accent-bright' : 'text-muted'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="md:hidden text-accent-bright text-2xl leading-none w-8 h-8 flex items-center justify-center"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? '×' : '☰'}
          </button>
        </div>
      </div>

      <div className={`md:hidden glass border-t border-accent overflow-hidden transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0 border-t-0'}`}>
        <div className="px-5 py-4 flex flex-col gap-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={pathname === item.href ? 'text-accent-bright' : 'text-muted hover:text-accent-bright'}
            >
              {item.label}
            </Link>
          ))}
          <div className="ink-divider" />
          <div className="flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`text-xs px-3 py-1.5 rounded-full border border-accent ${theme === t.id ? 'text-accent-bright' : 'text-muted'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}