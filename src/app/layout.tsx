import type { Metadata } from 'next';
import { Playfair_Display, Inter, Noto_Nastaliq_Urdu, Noto_Sans_Devanagari, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';

const display = Playfair_Display({ subsets: ['latin'], variable: '--font-display', weight: ['500', '600', '700', '800'] });
const body = Inter({ subsets: ['latin'], variable: '--font-body', weight: ['400', '500', '600'] });
const urdu = Noto_Nastaliq_Urdu({ subsets: ['arabic'], variable: '--font-urdu', weight: ['400', '700'] });
const devanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], variable: '--font-devanagari', weight: ['400', '600'] });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500'] });

export const metadata: Metadata = {
  title: 'Inkwell — A Digital Shayari Diary',
  description: 'A quiet corner for shayari and poems — love, longing, life, and everything between the lines.',
  openGraph: {
    title: 'Inkwell — A Digital Shayari Diary',
    description: 'A quiet corner for shayari and poems — love, longing, life, and everything between the lines.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${urdu.variable} ${devanagari.variable} ${mono.variable}`}>
      <body className="bg-ink text-parchment font-body antialiased selection:bg-gold/30 selection:text-parchment">
        <ThemeProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
