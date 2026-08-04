// Seeds a handful of sample poems so the site isn't empty on first run.
// Usage: node scripts/seed.mjs   (reads MONGODB_URI from .env.local)
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// minimal .env.local loader (avoids adding a dotenv dependency)
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2];
  }
}
loadEnv();

const PoemSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    body: String,
    language: String,
    category: String,
    tags: [String],
    author: String,
    ambience: String,
    featured: Boolean,
    published: Boolean,
    likes: Number,
    views: Number,
  },
  { timestamps: true }
);
const Poem = mongoose.models.Poem || mongoose.model('Poem', PoemSchema);

const samples = [
  {
    title: 'What the Rain Remembers',
    slug: 'what-the-rain-remembers',
    body: 'Every drop that falls tonight\nknows the shape of your absence.\nI leave the window open\njust in case you\'re listening.',
    language: 'English',
    category: 'Love',
    tags: ['rain', 'longing'],
    author: 'Inkwell',
    ambience: 'rain',
    featured: true,
  },
  {
    title: 'Purani Dosti',
    slug: 'purani-dosti',
    body: 'हम मिले थे राहों में,\nअजनबी बनकर,\nआज साथ चलते हैं,\nसाया बनकर।',
    language: 'Hindi',
    category: 'Friendship',
    tags: ['dosti', 'yaadein'],
    author: 'Inkwell',
    ambience: 'fireflies',
  },
  {
    title: 'گر ہمت',
    slug: 'gar-himmat',
    body: 'گر ہمت ہو تو راستے خود بنتے ہیں،\nمنزل دور نہیں، بس نظر بدلنی ہے۔',
    language: 'Urdu',
    category: 'Urdu Shayari',
    tags: ['himmat', 'safar'],
    author: 'Inkwell',
    ambience: 'stars',
  },
  {
    title: 'Getting Up Anyway',
    slug: 'getting-up-anyway',
    body: 'The mountain doesn\'t care\nhow tired you are.\nClimb anyway.\nThe view was never the point —\nthe climbing was.',
    language: 'English',
    category: 'Motivation',
    tags: ['strength', 'discipline'],
    author: 'Inkwell',
    ambience: 'stars',
  },
  {
    title: 'Quiet Rooms',
    slug: 'quiet-rooms',
    body: 'Grief doesn\'t announce itself.\nIt just sits in the chair\nyou used to save for someone else.',
    language: 'English',
    category: 'Sad',
    tags: ['grief', 'silence'],
    author: 'Inkwell',
    ambience: 'smoke',
  },
  {
    title: 'Ordinary Tuesday',
    slug: 'ordinary-tuesday',
    body: 'No one writes poems about Tuesdays\nbut here I am,\ngrateful for tea gone lukewarm\nand a life that kept happening.',
    language: 'English',
    category: 'Life',
    tags: ['gratitude', 'ordinary'],
    author: 'Inkwell',
    ambience: 'none',
  },
  {
    title: 'Where the Wild Things Bloom',
    slug: 'where-the-wild-things-bloom',
    body: 'The forest doesn\'t apologize\nfor growing wild.\nNeither should you.',
    language: 'English',
    category: 'Nature',
    tags: ['forest', 'freedom'],
    author: 'Inkwell',
    ambience: 'petals',
  },
  {
    title: 'बारिश की चाय',
    slug: 'baarish-ki-chai',
    body: 'बारिश और चाय की भाप में,\nखो जाते हैं सारे गिले शिकवे,\nज़िन्दगी थोड़ी सी थम जाती है,\nबस उस एक कप में।',
    language: 'Hindi',
    category: 'Hindi Poems',
    tags: ['chai', 'baarish'],
    author: 'Inkwell',
    ambience: 'rain',
  },
];

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not found. Add it to .env.local first.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.');

  for (const s of samples) {
    await Poem.findOneAndUpdate(
      { slug: s.slug },
      { ...s, likes: s.likes ?? Math.floor(Math.random() * 40), views: s.views ?? Math.floor(Math.random() * 200), published: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('Seeded:', s.title);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
