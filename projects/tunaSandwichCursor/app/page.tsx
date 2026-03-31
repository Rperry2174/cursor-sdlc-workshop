import Image from "next/image";
import Link from "next/link";
import { getFeaturedArtworks } from "@/lib/artworks";
import { ArtworkCard } from "./components/ArtworkCard";

export default function Home() {
  const featured = getFeaturedArtworks();

  return (
    <div className="bg-[color:var(--background)]">
      <section className="border-b border-[color:var(--secondary)]">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              The Gallery
            </p>
            <h1 className="font-serif text-3xl leading-snug sm:text-4xl">
              A calm online space for photographs, drawings, paintings, and
              objects.
            </h1>
            <p className="max-w-xl text-sm text-neutral-700 dark:text-neutral-200">
              Wander through a quiet collection of work. The lights are soft,
              the walls are warm, and the art is the only thing asking for your
              attention.
            </p>
            <div className="flex flex-wrap gap-4 text-xs uppercase tracking-wide">
              <Link
                href="/gallery"
                className="rounded-full border border-[color:var(--accent)] bg-[color:var(--accent)] px-4 py-2 text-white"
              >
                View the gallery
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-[color:var(--secondary)] px-4 py-2 text-neutral-800 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] dark:text-neutral-100"
              >
                About the artist
              </Link>
            </div>
          </div>
          <div className="relative mt-4 h-72 flex-1 overflow-hidden rounded-md border border-[color:var(--secondary)] bg-[color:var(--secondary)]/40 sm:h-80">
            <Image
              src="/images/hero.svg"
              alt="Soft light falling across framed artwork in a quiet gallery room."
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="border-b border-[color:var(--secondary)] bg-[color:var(--background)]">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="font-serif text-lg uppercase tracking-[0.25em]">
              Featured works
            </h2>
            <Link
              href="/gallery"
              className="text-xs uppercase tracking-wide text-neutral-600 hover:text-[color:var(--accent)] dark:text-neutral-200"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((art) => (
              <ArtworkCard key={art.id} artwork={art} />
            ))}
            {featured.length === 0 && (
              <p className="text-sm text-neutral-600 dark:text-neutral-200">
                Featured works will appear here once artwork entries are added.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
