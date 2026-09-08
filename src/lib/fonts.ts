export type FontCategory = 'clean' | 'handwritten' | 'elegant' | 'bold';

export interface FontOption {
  id: string;
  label: string;
  hindiLabel: string;
  family: string;
  style: string;
  category: FontCategory;
}

export const FONT_CATEGORIES: { id: FontCategory; label: string }[] = [
  { id: 'clean', label: '🖋️ Modern / Clean / Minimal' },
  { id: 'handwritten', label: '✍️ Handwritten / Personal' },
  { id: 'elegant', label: '📖 Elegant / Serif / Literary' },
  { id: 'bold', label: '🎭 Bold / Poster / Dramatic' },
];

export const FONT_OPTIONS: FontOption[] = [
  // Modern / Clean / Minimal
  { id: 'hind', label: 'Hind', hindiLabel: 'हिन्द (Hind)', family: "'Hind', sans-serif", style: 'Professional, Clean', category: 'clean' },
  { id: 'noto-sans', label: 'Noto Sans', hindiLabel: 'नोटो सांस (Noto Sans)', family: "'Noto Sans Devanagari', sans-serif", style: 'Clean, Universal', category: 'clean' },
  { id: 'mukta', label: 'Mukta', hindiLabel: 'मुक्ता (Mukta)', family: "'Mukta', sans-serif", style: 'Modern, Minimal', category: 'clean' },
  { id: 'baloo2', label: 'Baloo 2', hindiLabel: 'बालू 2 (Baloo 2)', family: "'Baloo 2', cursive", style: 'Rounded, Friendly', category: 'clean' },
  { id: 'baloo-bhai2', label: 'Baloo Bhai 2', hindiLabel: 'बालू भाई 2 (Baloo Bhai 2)', family: "'Baloo Bhai 2', cursive", style: 'Bold, Dramatic', category: 'clean' },
  { id: 'hind-siliguri', label: 'Hind Siliguri', hindiLabel: 'हिन्द सिलीगुड़ी (Hind Siliguri)', family: "'Hind Siliguri', sans-serif", style: 'Clean, Regional', category: 'clean' },
  { id: 'hind-vadodara', label: 'Hind Vadodara', hindiLabel: 'हिन्द वडोदरा (Hind Vadodara)', family: "'Hind Vadodara', sans-serif", style: 'Balanced Weight', category: 'clean' },
  { id: 'hind-guntur', label: 'Hind Guntur', hindiLabel: 'हिन्द गुंटूर (Hind Guntur)', family: "'Hind Guntur', sans-serif", style: 'Minimal, Modern', category: 'clean' },
  { id: 'karma', label: 'Karma', hindiLabel: 'कर्मा (Karma)', family: "'Karma', serif", style: 'Serif-Sans Hybrid', category: 'clean' },
  { id: 'palanquin', label: 'Palanquin', hindiLabel: 'पालंकीन (Palanquin)', family: "'Palanquin', sans-serif", style: 'Geometric, Versatile', category: 'clean' },
  { id: 'poppins', label: 'Poppins', hindiLabel: 'पॉपिन्स (Poppins)', family: "'Poppins', 'Noto Sans Devanagari', sans-serif", style: 'Trendy Geometric', category: 'clean' },

  // Handwritten / Personal
  { id: 'kalam', label: 'Kalam', hindiLabel: 'कलम (Kalam)', family: "'Kalam', cursive", style: 'Soft Handwritten', category: 'handwritten' },
  { id: 'tillana', label: 'Tillana', hindiLabel: 'तिल्लाना (Tillana)', family: "'Tillana', cursive", style: 'Flowing Cursive', category: 'handwritten' },
  { id: 'sumana', label: 'Sumana', hindiLabel: 'सुमना (Sumana)', family: "'Sumana', serif", style: 'Brush-style Strokes', category: 'handwritten' },

  // Elegant / Serif / Literary
  { id: 'eczar', label: 'Eczar', hindiLabel: 'एज़ार (Eczar)', family: "'Eczar', serif", style: 'Poetic, Book-like', category: 'elegant' },
  { id: 'martel', label: 'Martel', hindiLabel: 'मार्टेल (Martel)', family: "'Martel', serif", style: 'Formal Serif, Classic', category: 'elegant' },
  { id: 'rozha-one', label: 'Rozha One', hindiLabel: 'रोझा वन (Rozha One)', family: "'Rozha One', serif", style: 'Dramatic Display Serif', category: 'elegant' },
  { id: 'vesper-libre', label: 'Vesper Libre', hindiLabel: 'वेस्पर लिब्रे (Vesper Libre)', family: "'Vesper Libre', serif", style: 'Storybook Feel', category: 'elegant' },

  // Bold / Poster / Dramatic
  { id: 'rajdhani', label: 'Rajdhani', hindiLabel: 'राजधानी (Rajdhani)', family: "'Rajdhani', sans-serif", style: 'Tall, Poster-Style', category: 'bold' },
  { id: 'khand', label: 'Khand', hindiLabel: 'खांड (Khand)', family: "'Khand', sans-serif", style: 'Strong, Impactful', category: 'bold' },
  { id: 'yatra-one', label: 'Yatra One', hindiLabel: 'यात्रा वन (Yatra One)', family: "'Yatra One', cursive", style: 'Decorative, Eye-Catching', category: 'bold' },
  { id: 'teko', label: 'Teko', hindiLabel: 'टेको (Teko)', family: "'Teko', sans-serif", style: 'Narrow, Bold Poster', category: 'bold' },
];

export function getFontFamily(fontId?: string): string {
  if (!fontId) return "'Hind', 'Noto Sans Devanagari', sans-serif";
  const found = FONT_OPTIONS.find((f) => f.id === fontId);
  return found ? found.family : "'Hind', 'Noto Sans Devanagari', sans-serif";
}
