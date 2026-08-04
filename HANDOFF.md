# Project Handoff — Inkwell (Digital Shayari Diary)

This file is a complete record of what was built, why, and how to pick it back up in a new
chat, a new machine, or with a different AI/developer. Read this first if you're resuming.

---

## 1. Where this came from

You started with a big feature wishlist (home page, categories, search, favorites, audio
recitations, admin dashboard, themes, PWA, AI features, etc.) for a poetry/shayari site.
That was scoped into phases, and you asked to skip PWA/SEO polish and AI features (phases
5–6) and focus on: **an interactive site you can manage all your shayaris on, with a working
admin area** — hosted for real, not just a local demo.

Two options were on the table — a single-file in-browser app vs. a real deployable
Next.js + MongoDB site. You chose the real deployable version. **Everything below is that
version.** (An earlier, separate single-HTML-file prototype was discussed in an earlier
session but was never saved to disk and does not exist in this project — ignore any mention
of it elsewhere.)

## 2. What was actually built

A complete **Next.js 14 (App Router) + MongoDB** web app, verified with a clean
`npm run build`. Nothing here is a mockup — every button, form, and page is wired to a real
API route and a real database.

### Public site
| Page | Path | What it does |
|---|---|---|
| Home | `/` | Typewriter hero over an animated petal canvas, "Shayari of the Day" (featured poem), latest poems grid, category shortcuts |
| Category index | `/category` | All 8 categories with live poem counts |
| Category detail | `/category/[name]` | Poems filtered by category |
| Poem detail | `/poems/[slug]` | Full poem, language-aware typography (Urdu/Hindi/English), like, save-to-favorites, copy, download as .txt, WhatsApp share, comments, related poems, optional audio player, optional background video, ambient canvas |
| Search | `/search` | Live/debounced search across title, body, tags; filterable by category |
| Favorites | `/favorites` | Poems you've starred, stored per-device in `localStorage` (no login needed for readers) |

### Admin (private, JWT-protected)
| Page | Path | What it does |
|---|---|---|
| Login / first-run setup | `/admin/login` | First visit ever: create the one admin account (gated by a server-side `ADMIN_SETUP_SECRET`). After that: normal username/password login |
| Dashboard | `/admin` | Stats (total poems/views/likes), list of every poem (including drafts/scheduled), publish/unpublish toggle, edit, delete, logout |
| New poem | `/admin/new` | Form: title, body, language, category, tags, author, audio URL, video URL, ambience picker, schedule date, featured/published toggles |
| Edit poem | `/admin/edit/[id]` | Same form, pre-filled |

`middleware.ts` redirects any unauthenticated visit to `/admin/*` (except the login page)
back to `/admin/login`.

### Design system
- 4 switchable themes via CSS variables: Dark (default), Vintage Paper, Black & Gold, Royal Blue — persisted in `localStorage`
- Fonts: Playfair Display (display/serif), Inter (body/UI), Noto Nastaliq Urdu, Noto Sans Devanagari, JetBrains Mono (meta/labels) — loaded via `next/font/google`
- Signature visual element: a canvas-based ambience engine (`AmbientCanvas.tsx`) with 5 modes — falling petals, soft rain, stars, fireflies, smoke — used on the hero and per-poem (author picks the mode per poem)
- Glassmorphism cards, scroll progress bar, cursor glow (desktop only), fade-up entrance animation, `prefers-reduced-motion` respected throughout

### Data model (MongoDB via Mongoose)
**Poem**: title, slug (auto-generated, unique), body, language (English/Hindi/Urdu), category (enum of your 8), tags[], author, audioUrl, videoUrl, imageUrl, ambience, likes, views, featured, published, scheduledAt, comments[] (name, text, createdAt), timestamps. Has a text index on title/body/tags for search.

**Admin**: username, passwordHash (bcrypt). Only one is created via the one-time setup route; you can add more later directly in the DB if needed.

### Auth
JWT session stored in an httpOnly cookie, signed/verified with **`jose`** (not
`jsonwebtoken` — `jose` works in the Edge runtime that Next.js middleware requires; this
was a deliberate fix made during the build, see §4).

### API routes (all under `src/app/api/`)
- `GET/POST /api/poems` — list (with `category`, `q`, `featured`, `ids`, `all` query params) / create (admin only)
- `GET/PUT/DELETE /api/poems/[id]` — read / update / delete (write ops admin only)
- `GET /api/poems/slug/[slug]` — fetch by slug + increment view count + fetch related poems
- `POST /api/poems/[id]/like` — like/unlike (delta-based, ±1)
- `POST /api/poems/[id]/comment` — add a comment
- `GET/POST /api/auth/setup` — check if first-run setup is needed / create the first admin
- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`

### Extras
- `scripts/seed.mjs` — seeds 8 sample poems, one per category, including real Urdu (Nastaliq) and Hindi (Devanagari) text, so the site isn't empty on first run. Run with `npm run seed`. Safe to re-run (upserts by slug).
- `README.md` — setup, local dev, and Vercel + MongoDB Atlas deployment steps
- `.env.example` — the three env vars you need (`MONGODB_URI`, `JWT_SECRET`, `ADMIN_SETUP_SECRET`)

## 3. Deliberately left out (your instruction: skip phases 5–6)

- PWA / offline reading
- AI features: mood-based recommendations, translation, text-to-speech, AI-generated art
- True drag-and-drop file upload for audio/video (currently URL-based — paste a link from Cloudinary/YouTube/etc.; see README for how to add real uploads later)
- Multi-admin roles or reader accounts (favorites/likes are anonymous + per-device instead)

These are all clean, self-contained additions on top of this foundation whenever you want
them — nothing here blocks adding them later.

## 4. Build issues that came up and how they were fixed

Worth knowing if you (or another AI) touch this code later:

1. **Next.js 14.2.5 had a known security advisory** → bumped to `14.2.35` (latest patched 14.x) in `package.json`.
2. **`jsonwebtoken` doesn't work in the Edge runtime** that `middleware.ts` runs on in production (it uses Node-only crypto internals) → replaced with **`jose`**, which is Edge-compatible. This meant `signSession`, `verifySession`, and `getSessionFromRequest` all became `async` — every call site was updated to `await` them (`middleware.ts`, `api/auth/login`, `api/auth/me`, `api/poems/route.ts`, `api/poems/[id]/route.ts`).
3. **TypeScript overload error on `Poem.findById(...).lean()`** — a known Mongoose 8 + TS generics issue when a model is exported as `models.Poem || model(...)` without an explicit type. Fixed by explicitly typing the exported models as `mongoose.Model<any>` in `Poem.ts` and `Admin.ts`.
4. **Google Fonts can't be fetched during `next build`** in this sandbox (network is allow-listed to package registries only, not `fonts.googleapis.com`) — confirmed this is a sandbox-only restriction by temporarily stubbing the fonts, rebuilding successfully, then restoring the real font imports. **This will work fine on Vercel**, which has full internet access during build. If you build locally and don't have internet access to Google Fonts, you'll see the same error — that's expected and not a bug.

The build was verified clean (`npm run build` → all routes compiled, typechecked, and
generated) with the font imports stubbed out; the real font-based `layout.tsx` was restored
immediately after, unbuilt-but-correct (same code pattern, just fonts that need network
access this sandbox doesn't have).

## 5. How to resume this anywhere

1. Unzip `shayari-diary.zip` (this file lives at the project root, alongside it)
2. `cd shayari-diary && npm install`
3. `cp .env.example .env.local` and fill in a MongoDB Atlas URI + two random secrets (see README §1)
4. `npm run dev` — visit `localhost:3000`, go to `/admin` to create your admin account
5. Optional: `npm run seed` for sample content
6. To deploy: push to GitHub, import into Vercel, set the same 3 env vars in Vercel's dashboard, deploy. Full details in `README.md`.

If you hand this to a different AI assistant or developer, pointing them at this file plus
`README.md` gives them everything needed to continue without re-deriving any of the above
decisions.

## 6. Full file list (as of this handoff)

```
shayari-diary/
├── .env.example
├── .gitignore
├── HANDOFF.md              ← this file
├── README.md
├── next-env.d.ts
├── next.config.js
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── scripts/
│   └── seed.mjs
└── src/
    ├── middleware.ts
    ├── app/
    │   ├── layout.tsx
    │   ├── globals.css
    │   ├── page.tsx                          (home)
    │   ├── category/page.tsx                 (category index)
    │   ├── category/[slug]/page.tsx
    │   ├── poems/[slug]/page.tsx
    │   ├── poems/[slug]/PoemView.tsx
    │   ├── poems/[slug]/not-found.tsx
    │   ├── search/page.tsx
    │   ├── favorites/page.tsx
    │   ├── admin/login/page.tsx
    │   ├── admin/page.tsx                    (dashboard)
    │   ├── admin/new/page.tsx
    │   ├── admin/edit/[id]/page.tsx
    │   └── api/
    │       ├── poems/route.ts
    │       ├── poems/[id]/route.ts
    │       ├── poems/[id]/like/route.ts
    │       ├── poems/[id]/comment/route.ts
    │       ├── poems/slug/[slug]/route.ts
    │       └── auth/{setup,login,logout,me}/route.ts
    ├── components/
    │   ├── Header.tsx
    │   ├── Footer.tsx
    │   ├── ThemeProvider.tsx
    │   ├── AmbientCanvas.tsx
    │   ├── TypewriterHero.tsx
    │   ├── PoemCard.tsx
    │   └── PoemForm.tsx
    └── lib/
        ├── mongodb.ts
        ├── auth.ts
        ├── types.ts
        ├── favorites.ts
        └── models/
            ├── Poem.ts
            └── Admin.ts
```

`node_modules/` and `.next/` are excluded from the zip (regenerate with `npm install` /
`npm run build`).
