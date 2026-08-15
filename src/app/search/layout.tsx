import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'खोज · शायरी तलाशें',
  description: 'शीर्षक, अल्फ़ाज़, मिसरे या किसी खास भाव के आधार पर मुरीद शाइर की रचनाएँ ढूँढें।',
  openGraph: {
    title: 'खोज · शायरी तलाशें — मुरीद शाइर',
    description: 'शीर्षक, अल्फ़ाज़, मिसरे या किसी खास भाव के आधार पर रचनाएँ ढूँढें।',
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
