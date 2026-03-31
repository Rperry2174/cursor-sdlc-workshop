import { notFound } from "next/navigation";
import { getAllArtworks, getArtworksByCollection } from "@/lib/artworks";
import { PageHeader } from "../../components/PageHeader";
import { ArtworkCard } from "../../components/ArtworkCard";

type Params = {
  slug: string;
};

export function generateStaticParams() {
  const artworks = getAllArtworks();
  const slugs = new Set<string>();
  artworks.forEach((art) => {
    art.collections?.forEach((slug) => slugs.add(slug));
  });
  return Array.from(slugs).map((slug) => ({ slug }));
}

export default function CollectionPage({ params }: { params: Params }) {
  const artworks = getArtworksByCollection(params.slug);

  if (!artworks || artworks.length === 0) {
    notFound();
  }

  return (
    <div className="bg-[color:var(--background)]">
      <PageHeader
        title={`Collection: ${params.slug}`}
        subtitle="A quiet, unlisted grouping of works."
      />
      <section>
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.map((art) => (
              <ArtworkCard key={art.id} artwork={art} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

