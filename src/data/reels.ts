export interface ReelItem {
  id: string;
  url: string;
  title: string;
  caption?: string;
  date?: string;
  tags?: string[];
}

/**
 * =========================================================================
 * ALL OFFICIAL INSTAGRAM REELS & POSTS — मुरीद शाइर (@suru33_)
 * =========================================================================
 */
export const REELS_DATA: ReelItem[] = [
  {
    id: 'reel-ranjhana',
    url: 'https://www.instagram.com/reel/DYRuIiXocoO/',
    title: 'राँझणा रीमिक्स शायरी',
    caption: 'राँझणा रीमिक्स शायरी ❤️‍🩹 — आवाज़ और जज़्बातों की जुगलबंदी।',
    date: '2026-05-13',
    tags: ['शायरी', 'ट्रेंडिंग', 'love', 'राँझणा', 'sad'],
  },
  {
    id: 'reel-shehzadi',
    url: 'https://www.instagram.com/reel/DP2r2b7kVsI/',
    title: 'शहज़ादी',
    caption: 'शहज़ादी — एकतरफ़ा मोहब्बत और दिल के अनकहे जज़्बातों का इज़हार।',
    date: '2025-10-15',
    tags: [
      'शायरी',
      'love',
      'reels',
      'ट्रेंडिंग',
      'viralshayari',
      'onesidedlove',
      'ग़ज़ल',
      'poet',
      'poetry',
      'मोहब्बत',
      'viral',
      'shayaris',
    ],
  },
  {
    id: 'post-mureed-1',
    url: 'https://www.instagram.com/p/DUN8edlCH3A/',
    title: 'मुरीद शाइर की शायरी',
    caption: 'मुरीद शाइर की कलम से दिल को छू लेने वाली रचना।',
    date: '2026-02-01',
    tags: ['शायरी', 'काव्य', 'मुरीद_शाइर'],
  },
  {
    id: 'reel-nazm-mohabbat',
    url: 'https://www.instagram.com/reel/DRSf3j4DIN4/',
    title: 'नज़्म मोहब्बत',
    caption: 'नज़्म मोहब्बत — दिल की गहराइयों से निकली कुछ अनकही दास्तानें।',
    date: '2025-11-20',
    tags: [
      'शायरी',
      'viral',
      'reels',
      'ट्रेंडिंग',
      'viralshayari',
      'onesidedlove',
      'trending',
      'ग़ज़ल',
    ],
  },
  {
    id: 'reel-love-shayari',
    url: 'https://www.instagram.com/reel/DV3YHYIiC4b/',
    title: 'लव शायरी',
    caption: 'लव शायरी — मोहब्बत के एहसास और नई उम्मीदों का खूबसूरत कलाम।',
    date: '2026-03-14',
    tags: ['viral', 'शायरी', 'love', 'new', 'collageboy'],
  },
];
