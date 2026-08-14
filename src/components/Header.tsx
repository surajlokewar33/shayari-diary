'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const NAV = [
  { href: '/', label: 'होम' },
  { href: '/category', label: 'श्रेणियाँ' },
  { href: '/reels', label: 'रील्स' },
  { href: '/search', label: 'खोज' },
  { href: '/favorites', label: 'पसंदीदा' },
  { href: '/contact', label: 'शायर' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-maroon-elevated/95 backdrop-blur-xl border-gold/30 shadow-card py-2.5'
          : 'bg-maroon/70 backdrop-blur-md border-gold/15 py-3.5'
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 flex items-center justify-between">
        {/* Brand Lockup: मुरीद शाइर */}
        <Link
          href="/"
          className="flex items-center gap-3 group min-h-[44px] py-1"
          aria-label="मुरीद शाइर Home"
        >
          <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold group-hover:border-amber group-hover:scale-105 transition-all shadow-sm">
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

          <div className="flex items-baseline">
            <span className="font-devanagari text-xl font-bold tracking-tight text-parchment group-hover:text-amber transition-colors">
              मुरीद शाइर
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 font-devanagari text-sm">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 rounded-full transition-all min-h-[40px] flex items-center ${
                  active
                    ? 'bg-gold/15 text-amber font-semibold border border-gold/35 shadow-sm'
                    : 'text-cream/80 hover:text-parchment hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle (Min 44x44px touch target) */}
        <button
          className="md:hidden text-amber w-11 h-11 rounded-full glass border border-gold/30 flex items-center justify-center text-xl focus-visible:ring-2 focus-visible:ring-gold/60 focus:outline-none transition-all active:scale-95"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close Menu' : 'Open Menu'}
          aria-expanded={open}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`md:hidden glass border-t border-gold/20 overflow-hidden transition-all duration-300 ${
          open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-5 flex flex-col gap-2">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`font-devanagari text-base px-4 py-3 rounded-2xl min-h-[48px] flex items-center transition-colors ${
                  active
                    ? 'bg-gold/20 text-amber font-bold border border-gold/30'
                    : 'text-cream/90 hover:text-parchment hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}