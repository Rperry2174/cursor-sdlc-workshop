import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArtworks, getArtworkById } from "@/lib/artworks";

type Params = {
  id: string;
};

export function generateStaticParams() {
  const artworks = getAllArtworks();
  return artworks.map((art) => ({ id: art.id }));
}

export default function ArtworkDetailPage({ params }: { params: Params }) {
  const artwork = getArtworkById(params.id);

  if (!artwork) {
    notFound();
  }

  return (
    <div className="bg-[color:var(--background)]">
      <section className="border-b border-[color:var(--secondary)] bg-[color:var(--background)]">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-xs uppercase tracking-wide text-neutral-600 dark:text-neutral-200">
            <Link
              href="/gallery"
              className="hover:text-[color:var(--accent)]"
            >
              Gallery
            </Link>{" "}
            / <span>{artwork.title}</span>
          </div>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="relative overflow-hidden rounded-md border border-[color:var(--secondary)] bg-[color:var(--background)]">
              <div className="relative aspect-[4/3] sm:aspect-[5/4]">
                <Image
                  src={artwork.image}
                  alt={artwork.description || artwork.title}
                  fill
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <aside className="space-y-4 text-sm">
              <div>
                <h1 className="font-serif text-xl uppercase tracking-[0.2em]">
                  {artwork.title}
                </h1>
                <p className="mt-2 text-neutral-700 dark:text-neutral-200">
                  {artwork.medium}
                </p>
              </div>
              <dl className="space-y-1 text-xs text-neutral-600 dark:text-neutral-200">
                <div className="flex gap-2">
                  <dt className="w-20 uppercase">Year</dt>
                  <dd>{artwork.year}</dd>
                </div>
                {artwork.dimensions ? (
                  <div className="flex gap-2">
                    <dt className="w-20 uppercase">Size</dt>
                    <dd>{artwork.dimensions}</dd>
                  </div>
                ) : null}
                <div className="flex gap-2">
                  <dt className="w-20 uppercase">Medium</dt>
                  <dd>{artwork.category}</dd>
                </div>
              </dl>
              {artwork.description ? (
                <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-200">
                  {artwork.description}
                </p>
              ) : null}
              {artwork.inquirable && (
                <div className="pt-4">
                  <a href="#inquiry" className="text-xs uppercase tracking-wide text-[color:var(--accent)]">
                    Inquire about this piece
                  </a>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
      {artwork.inquirable && (
        <section
          id="inquiry"
          className="border-t border-[color:var(--secondary)] bg-[color:var(--background)]"
        >
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <h2 className="font-serif text-lg uppercase tracking-[0.2em]">
              Inquiry
            </h2>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-200">
              Interested in this work? Share a bit about yourself and how
              you&apos;d like to live with it.
            </p>
            <form
              className="mt-6 grid gap-4 text-sm sm:grid-cols-2"
              action={process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT}
              method="POST"
            >
              <input type="hidden" name="artworkId" value={artwork.id} />
              <input type="hidden" name="artworkTitle" value={artwork.title} />
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-xs uppercase tracking-wide">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full rounded border border-[color:var(--secondary)] bg-[color:var(--background)] px-3 py-2"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="mb-1 block text-xs uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded border border-[color:var(--secondary)] bg-[color:var(--background)] px-3 py-2"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs uppercase tracking-wide">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full rounded border border-[color:var(--secondary)] bg-[color:var(--background)] px-3 py-2"
                />
              </div>
              <div className="col-span-2">
                <button
                  type="submit"
                  className="rounded-full border border-[color:var(--accent)] bg-[color:var(--accent)] px-6 py-2 text-xs uppercase tracking-wide text-white"
                >
                  Send inquiry
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}

