## The Gallery — Base MVP

This is a minimal Next.js + Tailwind implementation of **The Gallery** MVP described in `PRD.md`. It is designed to be static, easy to deploy, and simple to extend later (CMS, e‑commerce, etc.).

### Tech stack

- Next.js App Router (TypeScript)
- Tailwind CSS
- Framer Motion (subtle motion)
- JSON files for artwork content

### Running the app

```bash
cd base_mvp
npm run dev
```

Then open `http://localhost:3000` in your browser.

### Adding artworks

- Artwork JSON files live in `content/artworks/`.
- Each file follows this shape:

```json
{
  "id": "sunset-over-bay",
  "title": "Sunset Over the Bay",
  "category": "photography",
  "medium": "Digital photograph",
  "year": 2024,
  "dimensions": "24×36 in",
  "description": "Short artist note about the piece.",
  "image": "/images/artworks/sunset-over-bay.svg",
  "featured": true,
  "collections": ["winter-2025"],
  "inquirable": true
}
```

Valid `category` values are:

- `photography`
- `drawing`
- `painting`
- `mixed-media`

Images should be placed in:

- `public/images/artworks/` — artwork images (SVG or raster)
- `public/images/hero.svg` — home hero image
- `public/images/artist.svg` — about page portrait

### Inquiry form (Formspree)

Artwork detail pages include a minimal inquiry form that posts to a Formspree endpoint.

Configure the endpoint by setting this environment variable in `base_mvp/.env.local`:

```bash
NEXT_PUBLIC_FORMSPREE_ENDPOINT="https://formspree.io/f/your-form-id"
```

If the variable is unset, the form will still render but will submit to `undefined`, so configure this before sharing the site.

### Routes

- `/` — home, hero + featured works
- `/gallery` — all works with category filter
- `/gallery/[id]` — artwork detail + inquiry form
- `/about` — short artist bio and statement
- `/collection/[slug]` — unlisted curated collections based on the `collections` field

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
