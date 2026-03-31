import Link from "next/link";
import type { ArtworkCategory } from "@/lib/artworks";

const CATEGORY_LABELS: { value?: ArtworkCategory; label: string }[] = [
  { label: "All" },
  { value: "photography", label: "Photography" },
  { value: "drawing", label: "Drawings" },
  { value: "painting", label: "Paintings" },
  { value: "mixed-media", label: "Other / Mixed Media" },
];

type Props = {
  activeCategory?: ArtworkCategory;
};

export function CategoryFilter({ activeCategory }: Props) {
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {CATEGORY_LABELS.map((cat) => {
        const isActive =
          (!cat.value && !activeCategory) || cat.value === activeCategory;
        const href = cat.value
          ? `/gallery?category=${encodeURIComponent(cat.value)}`
          : "/gallery";
        return (
          <Link
            key={cat.label}
            href={href}
            className={`rounded-full border px-3 py-1 uppercase tracking-wide ${
              isActive
                ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-white"
                : "border-[color:var(--secondary)] text-neutral-700 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] dark:text-neutral-200"
            }`}
          >
            {cat.label}
          </Link>
        );
      })}
    </div>
  );
}

