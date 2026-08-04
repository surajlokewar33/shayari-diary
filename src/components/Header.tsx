'use client';

import Link from 'next/link';
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
  const [open, setOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto max-w-6xl px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-wide text-accent-bright">
          सूरु 33  <span className="text-muted text-sm font-body">· शाइर</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 font-body text-sm text-muted">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-accent-bright transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <button
              onClick={() => setThemeOpen((v) => !v)}
              className="text-xs px-3 py-1.5 rounded-full border border-accent text-muted hover:text-accent-bright transition-colors"
            >
              {THEMES.find((t) => t.id === theme)?.label}
            </button>
            {themeOpen && (
              <div className="absolute right-0 mt-2 w-44 glass rounded-lg overflow-hidden">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setTheme(t.id); setThemeOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-white/5 ${theme === t.id ? 'text-accent-bright' : 'text-muted'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/admin"
            className="hidden md:inline-block text-xs px-3 py-1.5 rounded-full border border-accent text-muted hover:text-accent-bright transition-colors"
          >
            Admin
          </Link>

          <button className="md:hidden text-accent-bright text-2xl leading-none" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? '×' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-accent px-5 py-4 flex flex-col gap-4">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="text-muted hover:text-accent-bright">
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
          <Link href="/admin" onClick={() => setOpen(false)} className="text-muted hover:text-accent-bright">
            Admin
          </Link>
        </div>
      )}
    </header>
  );
}