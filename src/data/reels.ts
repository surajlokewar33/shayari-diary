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
 * ADD NEW INSTAGRAM REELS HERE
 * =========================================================================
 * Simply add a new object to this array with:
 * - id: Unique string identifier
 * - url: The Instagram Reel URL (e.g., https://www.instagram.com/suru33_/reel/DYRuliXocoO/)
 * - title: Title or first line in Hindi/Devanagari
 * - caption: Short description or poetic note (optional)
 * - date: Date of posting (optional)
 * - tags: Array of topic tags (optional)
 * =========================================================================
 */
export const REELS_DATA: ReelItem[] = [
  {
    id: 'reel-suru-1',
    url: 'https://www.instagram.com/suru33_/reel/DYRuliXocoO/',
    title: 'सूरु शाइर की प्रस्तुति — काव्य रील',
    caption: 'हर लफ़्ज़ में एक दास्ताँ, हर शेर में एक राज़ है। आवाज़ और जज़्बातों की जुगलबंदी।',
    date: '2024-08-14',
    tags: ['शायरी', 'उर्दू_शायरी', 'suru33', 'सूरु_शाइर'],
  },
  {
    id: 'reel-2',
    url: 'https://www.instagram.com/reel/C1x_K9qP8_y/',
    title: 'ये दिन भी कभी गुज़रेगा, मेरे लिखे शेर रहेंगे...',
    caption: 'दर्द की आखिरी सीढ़ी पर लिखी कुछ अनकही पंक्तियाँ।',
    date: '2024-01-15',
    tags: ['ग़ज़ल', 'यादें', 'सूरु_शाइर'],
  },
  {
    id: 'reel-3',
    url: 'https://www.instagram.com/reel/C0a_M3rT9_z/',
    title: 'लफ़्ज़ों में समेट रखी है हमने दास्ताँ अपनी...',
    caption: 'जो दिल ने महसूस किया, काग़ज़ ने बयां कर दिया।',
    date: '2023-12-10',
    tags: ['नज़्म', 'एहसास', 'कविता'],
  },
];
