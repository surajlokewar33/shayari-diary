import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'पसंदीदा रचनाएँ',
  description: 'आपकी सहेजी गई पसंदीदा शायरियाँ — इस डिवाइस पर सुरक्षित।',
  openGraph: {
    title: 'पसंदीदा रचनाएँ — मुरीद शाइर',
    description: 'आपकी सहेजी गई पसंदीदा शायरियाँ।',
  },
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
