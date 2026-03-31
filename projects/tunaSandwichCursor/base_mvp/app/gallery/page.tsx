import { notFound } from "next/navigation";
import { getAllArtworks, getArtworksByCategory, type ArtworkCategory } from "@/lib/artworks";
import { PageHeader } from "../components/PageHeader";
import { ArtworkCard } from "../components/ArtworkCard";
import { CategoryFilter } from "../components/CategoryFilter";

type SearchParams = {
  category?: string;
};

function toCategory(value: string | undefined): ArtworkCategory | undefined {
  if (!value) return undefined;
  const allowed: ArtworkCategory[] = [
    "photography",
    "drawing",
    "painting",
    "mixed-media",
  ];
  return allowed.includes(value as ArtworkCategory)
    ? (value as ArtworkCategory)
    : undefined;
}

export default function GalleryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const category = toCategory(searchParams.category);
  const artworks = category
    ? getArtworksByCategory(category)
    : getAllArtworks();

  if (!artworks) {
    notFound();
  }

  return (
    <div className="bg-[color:var(--background)]">
      <PageHeader
        title="Gallery"
        subtitle="Browse all works or filter by medium."
      />
      <section className="border-b border-[color:var(--secondary)]">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <CategoryFilter activeCategory={category} />
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.map((art) => (
              <ArtworkCard key={art.id} artwork={art} />
            ))}
          </div>
          {artworks.length === 0 && (
            <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-200">
              No works found yet. Add artwork entries to{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">
                content/artworks
              </code>{" "}
              to populate this gallery.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

