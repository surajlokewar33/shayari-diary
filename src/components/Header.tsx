'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV = [
  { href: '/', label: 'होम' },
  { href: '/category', label: 'श्रेणियाँ' },
  { href: '/search', label: 'खोज' },
  { href: '/favorites', label: 'पसंदीदा' },
  { href: '/contact', label: 'शायर' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass border-b border-gold/20 backdrop-blur-xl transition-all">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand Lockup: suru_33 / सूरु शाइर */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full glass border border-gold/35 flex items-center justify-center text-gold group-hover:border-gold/60 group-hover:scale-105 transition-all shadow-sm">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gold shrink-0 transition-transform group-hover:rotate-6"
            >
              <path
                d="M4 20L15 9M15 9L18 6C18.5 5.5 19.5 5.5 20 6C20.5 6.5 20.5 7.5 20 8L17 11M15 9L17 11M4 20L6 15L11 17L4 20Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="font-ui text-sm sm:text-base font-bold tracking-tight text-parchment group-hover:text-amber transition-colors">
              suru_33
            </span>
            <span className="text-muted text-xs">/</span>
            <span className="font-devanagari text-base sm:text-lg font-bold text-parchment group-hover:text-amber transition-colors">
              सूरु शाइर
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 font-devanagari text-sm font-medium">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1 transition-colors ${
                  active ? 'text-amber font-semibold' : 'text-cream/80 hover:text-parchment'
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-gradient-to-r from-gold/40 via-gold to-gold/40 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-amber w-9 h-9 rounded-full glass border border-gold/30 flex items-center justify-center text-lg focus:outline-none"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle Menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`md:hidden glass border-t border-gold/15 overflow-hidden transition-all duration-300 ${
          open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`font-devanagari text-base py-1 transition-colors ${
                pathname === item.href
                  ? 'text-amber font-bold'
                  : 'text-cream/80 hover:text-parchment'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}