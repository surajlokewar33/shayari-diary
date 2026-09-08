import type { Metadata } from 'next';
import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
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

const devanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://suraurshayari.vercel.app'),
  title: {
    default: 'मुरीद शाइर — A Digital Shayari Diary',
    template: '%s — मुरीद शाइर',
  },
  description: 'मुरीद शाइर — हर शब्द एक एहसास, हर शेर एक कहानी। उर्दू शायरी, हिंदी कविताएँ, मराठी कविता, ग़ज़लें और नज़्में।',
  openGraph: {
    title: 'मुरीद शाइर — A Digital Shayari Diary',
    description: 'मुरीद शाइर — हर शब्द एक एहसास, हर शेर एक कहानी। उर्दू शायरी, हिंदी कविताएँ, मराठी कविता, ग़ज़लें और नज़्में।',
    type: 'website',
    siteName: 'मुरीद शाइर',
    images: [
      {
        url: '/hero_banner.jpg',
        width: 1200,
        height: 675,
        alt: 'मुरीद शाइर — A Digital Shayari Diary',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'मुरीद शाइर — A Digital Shayari Diary',
    description: 'मुरीद शाइर — हर शब्द एक एहसास, हर शेर एक कहानी। उर्दू शायरी, हिंदी कविताएँ, मराठी कविता, ग़ज़लें और नज़्में।',
    images: ['/hero_banner.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="hi"
      className={`${ui.variable} ${devanagari.variable}`}
    >
      <head>
        {/* Google Fonts CDN — all Devanagari font families for the font picker */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Baloo+Bhai+2:wght@400;500;600;700;800&family=Eczar:wght@400;500;600;700;800&family=Hind:wght@400;500;600;700&family=Hind+Guntur:wght@400;500;600;700&family=Hind+Siliguri:wght@400;500;600;700&family=Hind+Vadodara:wght@400;500;600;700&family=Kalam:wght@400;700&family=Karma:wght@400;500;600;700&family=Khand:wght@400;500;600;700&family=Martel:wght@400;600;700;800;900&family=Mukta:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Palanquin:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Rajdhani:wght@400;500;600;700&family=Rozha+One&family=Sumana:wght@400;700&family=Teko:wght@400;500;600;700&family=Tillana:wght@400;500;600;700;800&family=Vesper+Libre:wght@400;500;700&family=Yatra+One&display=swap"
          rel="stylesheet"
        />
      </head>
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
