# Product Requirements Document: The Gallery

## Overview

A design-first online art gallery to showcase a personal art collection spanning photography, drawings, paintings, and mixed media. The site should feel like walking into a calm, well-lit gallery — the art is the hero, and everything else gets out of the way.

---

## Goals

1. **Showcase the work beautifully** — large images, generous whitespace, smooth transitions.
2. **Organize by medium** — visitors can browse all work or filter by category.
3. **Allow purchase inquiries** — a lightweight "Interested in this piece?" flow, not a full e-commerce system.
4. **Shareable & public** — anyone with the link can visit; specific collections can be shared via private link.

---

## Target Audience

- **Primary:** Friends, family, and anyone the artist shares the link with.
- **Secondary:** The broader public discovering the work organically or through social sharing.

---

## Scope & Features

### v1 — MVP (Build This)

| Feature | Details |
|---|---|
| **Gallery Home** | Full-bleed hero image with artist name/tagline. Below: curated grid of recent or featured work. |
| **Category Browsing** | Filter tabs or nav for: **Photography**, **Drawings**, **Paintings**, **Other/Mixed Media**. Categories are defined in code and easy to extend. |
| **Artwork Detail View** | Large image (zoomable or lightbox), title, medium, dimensions (optional), year, and a short artist note (optional). |
| **Inquiry Button** | "Inquire About This Piece" opens a simple form: name, email, message. Submissions sent to a configured email address (e.g. via Formspree, Resend, or Netlify Forms). No pricing displayed. |
| **About Page** | Short bio, artist photo, and a personal statement. Keep it to one scroll. |
| **Private Collection Links** | Ability to create a shareable URL for a curated subset of works (e.g. `/collection/winter-2025`). Not password-protected — just unlisted. |
| **Responsive Design** | Mobile-first. Gallery grid adapts from 1-col on mobile to 2–3 col on desktop. Detail view is full-width on mobile. |
| **Content Management** | Markdown/JSON-based content files (no database). Each artwork is a file with metadata + image path. Simple enough for a developer to manage, but structured so a lightweight CMS (e.g. Decap CMS, Tina) can be added later. |

### v2 — Future (Don't Build Yet)

- CMS admin panel for the artist to self-manage uploads
- Print-on-demand or e-commerce integration
- Visitor favorites / "save to collection"
- Guestbook or comment wall
- Analytics dashboard for the artist

---

## Design Direction

### Principles
- **Art-first:** No visual clutter. The artwork should occupy the majority of viewport on every page.
- **Gallery aesthetic:** Think white-walled gallery — clean, confident, quiet. Subtle hover states, smooth page transitions.
- **Typography-driven:** One elegant serif for headings (e.g. Playfair Display, Cormorant Garofond), one clean sans-serif for body (e.g. Inter, DM Sans). Let type do the heavy lifting alongside the art.
- **Dark mode optional:** Default to light (white/off-white walls), with a dark mode toggle for photography-heavy viewing.

### Layout Patterns
- **Grid:** Masonry-style grid on category pages to let varying image aspect ratios breathe.
- **Detail:** Centered single image, metadata below or to the side on desktop.
- **Transitions:** Subtle fade-ins on scroll, smooth image-to-detail transitions (shared element animation if feasible).

### Color Palette
- Background: `#FAFAF8` (warm white)
- Text: `#1A1A1A` (soft black)
- Accent: `#8B7355` (warm bronze — used sparingly for links, buttons, hover states)
- Secondary: `#E8E4DF` (warm gray for borders, dividers)

---

## Technical Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Framework** | Next.js (App Router) | Great image optimization (next/image), static generation, easy deployment. |
| **Styling** | Tailwind CSS | Fast to build, easy to maintain, good responsive utilities. |
| **Hosting** | Vercel | Zero-config Next.js deploys, free tier is generous, global CDN for images. |
| **Image Storage** | `/public` folder or Cloudinary (free tier) | Start local, migrate to Cloudinary if image count exceeds ~100 or optimization is needed. |
| **Inquiry Form** | Formspree (free tier) | No backend needed. Sends submissions to email. Swap later if needed. |
| **Content Format** | JSON files in `/content/artworks/` | Each file = one artwork. Easy to script, easy to migrate to a CMS later. |
| **Animations** | Framer Motion | Lightweight, React-native, great for page transitions and scroll reveals. |

---

## Content Model

Each artwork entry (e.g. `/content/artworks/sunset-over-bay.json`):

```json
{
  "id": "sunset-over-bay",
  "title": "Sunset Over the Bay",
  "category": "photography",
  "medium": "Digital photograph",
  "year": 2024,
  "dimensions": "24×36 in",
  "description": "Captured during a weekend trip to Point Reyes.",
  "image": "/images/artworks/sunset-over-bay.jpg",
  "featured": true,
  "collections": ["winter-2025"],
  "inquirable": true
}
```

Categories enum: `photography | drawing | painting | mixed-media`

---

## Pages

| Route | Purpose |
|---|---|
| `/` | Home — hero + featured works grid |
| `/gallery` | All works, filterable by category |
| `/gallery/[id]` | Single artwork detail + inquiry button |
| `/about` | Artist bio and statement |
| `/collection/[slug]` | Private/unlisted curated collection |

---

## Success Criteria

- Site loads in under 2s on mobile (Lighthouse performance > 90).
- Artist (dad) says "this looks great" when he sees it.
- At least one inquiry form submission within the first month of sharing.
- Non-technical family members can navigate and enjoy it easily.

---

## Open Questions

1. Does dad have a name/brand he wants for the gallery, or just his name?
2. Are there existing high-res scans/photos, or do some works need to be digitized first?
3. Any pieces he specifically wants featured on the homepage?

---

## Timeline Estimate

| Phase | Duration |
|---|---|
| Setup + scaffold + design system | 1 day |
| Home + gallery + detail pages | 2–3 days |
| Inquiry form + about page | 1 day |
| Content entry (depends on # of pieces) | 1–2 days |
| Polish, responsive QA, deploy | 1 day |
| **Total** | **~1 week of focused effort** |
