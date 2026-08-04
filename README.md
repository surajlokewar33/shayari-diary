# Inkwell — Digital Shayari Diary

A full, hostable poetry/shayari website: public reading experience (search, categories,
likes, favorites, comments, audio recitations, ambient backgrounds) plus a private admin
dashboard to write, edit, schedule, and delete poems.

Built with **Next.js 14 (App Router)**, **MongoDB**, **Tailwind CSS**, and JWT-based admin
auth (`jose`, edge-runtime compatible).

## What's included

- Home page with animated hero, "Shayari of the Day", latest poems
- 8 categories (Love, Friendship, Motivation, Sad, Life, Nature, Urdu Shayari, Hindi Poems)
- Individual poem pages: typography per language (English/Hindi/Urdu fonts), like, save to
  favorites, copy, download as .txt, WhatsApp share, comments, related poems
- Live search across title/body/tags, filterable by category
- Favorites saved per-device (localStorage) — no reader account needed
- Admin dashboard: add/edit/delete poems, publish/unpublish, feature, schedule future posts,
  view counts and like counts
- Per-poem audio recitation URL and background video URL (paste a link — see note below)
- Built-in ambient canvas backgrounds (falling petals, rain, stars, fireflies, smoke) — no
  media hosting required
- 4 themes: Dark, Vintage Paper, Black & Gold, Royal Blue
- SEO: per-poem meta tags, Open Graph data

**About video/audio uploads:** this app takes a **URL**, not a file upload — paste a link to
an mp3/mp4 you've hosted on Cloudinary, YouTube, S3, etc. That keeps the app simple and free
to run; if you want true drag-and-drop file uploads later, wire up a Cloudinary or S3 upload
route in `src/app/api/` and point the admin form at it.

## 1. Local setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```
MONGODB_URI=...        # from MongoDB Atlas (see below)
JWT_SECRET=...          # any long random string
ADMIN_SETUP_SECRET=...  # any string — used once to create your admin account
```

Generate random secrets quickly with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Get a free MongoDB database
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Add a database user (username/password)
3. Under Network Access, allow access from anywhere (`0.0.0.0/0`) — or Vercel's IPs once deployed
4. Copy the connection string into `MONGODB_URI` in `.env.local`

### Run it
```bash
npm run dev
```
Visit `http://localhost:3000`. Go to `/admin` — the first visit prompts you to create your
admin account (you'll need the `ADMIN_SETUP_SECRET` you set above). After that it's a normal
login.

### (Optional) Seed sample poems
```bash
npm run seed
```
Adds 8 sample poems (one per category, including real Urdu and Hindi text) so the site isn't
empty. Safe to run multiple times — it upserts by slug.

## 2. Deploy it (Vercel + MongoDB Atlas)

1. Push this project to a GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. In the Vercel project's **Settings → Environment Variables**, add the same three variables
   from `.env.local` (`MONGODB_URI`, `JWT_SECRET`, `ADMIN_SETUP_SECRET`)
4. Deploy
5. Visit `https://your-site.vercel.app/admin` and create your admin account once (setup mode
   disables itself automatically after the first account is created)
6. Start writing — everything you add through `/admin` shows up live on the public site

No separate backend to host — API routes run on Vercel serverless functions, and the database
lives in MongoDB Atlas's free tier.

## 3. Project structure

```
src/
  app/
    page.tsx                 Home
    category/                Category index + per-category listing
    poems/[slug]/             Poem detail (server fetch + client interactivity)
    search/                   Live search
    favorites/                Saved poems (localStorage)
    admin/                    Login/setup, dashboard, new/edit poem forms
    api/                      REST routes: poems CRUD, likes, comments, auth
  components/                 Header, Footer, PoemCard, AmbientCanvas, ThemeProvider, PoemForm
  lib/
    mongodb.ts                Cached DB connection
    auth.ts                   JWT session helpers (jose, edge-compatible)
    models/                   Poem, Admin mongoose schemas
    types.ts, favorites.ts    Shared types + client-side favorites/likes storage
  middleware.ts                Protects /admin/* routes
scripts/seed.mjs               Optional sample data seeder
```

## 4. Notes on scope

This is a complete, production-ready v1 covering the "core diary + admin management" feature
set. Deliberately left out for a later pass (only add if you actually need them):
- PWA / offline reading
- AI features (mood-based suggestions, translation, text-to-speech)
- True file uploads (currently URL-based, see note above)
- Multi-admin roles / reader accounts

Each of those is a self-contained addition on top of this foundation whenever you're ready.
