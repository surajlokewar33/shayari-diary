import type { Metadata } from 'next';
import { Inter, Noto_Serif_Devanagari, Noto_Nastaliq_Urdu } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';

const ui = Inter({
  subsets: ['latin'],
  variable: '--font-ui',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const devanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const urdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  variable: '--font-urdu',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'suru_33 / सूरु शाइर — A Digital Shayari Diary',
  description: 'suru_33 / सूरु शाइर — हर शब्द एक एहसास, हर शेर एक कहानी। उर्दू शायरी, हिंदी कविताएँ, ग़ज़लें और नज़्में।',
  openGraph: {
    title: 'suru_33 / सूरु शाइर — A Digital Shayari Diary',
    description: 'suru_33 / सूरु शाइर — हर शब्द एक एहसास, हर शेर एक कहानी। उर्दू शायरी, हिंदी कविताएँ, ग़ज़लें और नज़्में।',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="hi"
      className={`${ui.variable} ${devanagari.variable} ${urdu.variable}`}
    >
      <body className="bg-ink text-parchment font-ui antialiased selection:bg-gold/30 selection:text-parchment overflow-x-hidden min-h-screen flex flex-col justify-between">
        <ThemeProvider>
          <Header />
          <main className="min-h-screen flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
