'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type ThemeName = 'ink' | 'vintage' | 'blackgold' | 'royal';

const ThemeContext = createContext<{
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
}>({ theme: 'ink', setTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('ink');
  const [progress, setProgress] = useState(0);
  const [glow, setGlow] = useState({ x: -1000, y: -1000, visible: false });

  useEffect(() => {
    const saved = (localStorage.getItem('shayari-theme') as ThemeName) || 'ink';
    setThemeState(saved);
  }, []);

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem('shayari-theme', t);
  };

  useEffect(() => {
    if (theme === 'ink') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (scrolled / max) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const isFine = window.matchMedia('(pointer: fine)').matches;
    if (!isFine) return;
    const onMove = (e: MouseEvent) => setGlow({ x: e.clientX, y: e.clientY, visible: true });
    const onLeave = () => setGlow((g) => ({ ...g, visible: false }));
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <div
        className="cursor-glow hidden md:block"
        style={{ left: glow.x, top: glow.y, opacity: glow.visible ? 1 : 0 }}
      />
      {children}
    </ThemeContext.Provider>
  );
}
