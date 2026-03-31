import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/lib/artworks";

type Props = {
  artwork: Artwork;
};

export function ArtworkCard({ artwork }: Props) {
  return (
    <Link
      href={`/gallery/${artwork.id}`}
      className="group flex flex-col gap-2"
      aria-label={artwork.title}
    >
      <div className="relative overflow-hidden rounded-md border border-[color:var(--secondary)] bg-[color:var(--background)]">
        <div className="relative aspect-[4/3]">
          <Image
            src={artwork.image}
            alt={artwork.description || artwork.title}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 768px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </div>
      <div className="flex flex-col text-xs">
        <span className="font-medium tracking-wide uppercase">
          {artwork.title}
        </span>
        <span className="text-neutral-600 dark:text-neutral-300">
          {artwork.medium}
        </span>
        <span className="text-neutral-500 dark:text-neutral-400">
          {artwork.year}
        </span>
      </div>
    </Link>
  );
}

