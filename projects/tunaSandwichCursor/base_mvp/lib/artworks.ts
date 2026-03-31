import fs from "node:fs";
import path from "node:path";

export type ArtworkCategory = "photography" | "drawing" | "painting" | "mixed-media";

export type Artwork = {
  id: string;
  title: string;
  category: ArtworkCategory;
  medium: string;
  year: number;
  dimensions?: string;
  description?: string;
  image: string;
  featured?: boolean;
  collections?: string[];
  inquirable?: boolean;
};

const ARTWORKS_DIR = path.join(process.cwd(), "content", "artworks");

function readArtworkFile(fileName: string): Artwork {
  const fullPath = path.join(ARTWORKS_DIR, fileName);
  const data = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(data) as Artwork;
}

export function getAllArtworks(): Artwork[] {
  if (!fs.existsSync(ARTWORKS_DIR)) {
    return [];
  }
  const files = fs.readdirSync(ARTWORKS_DIR).filter((file) => file.endsWith(".json"));
  const artworks = files.map((file) => readArtworkFile(file));
  return artworks.sort((a, b) => b.year - a.year);
}

export function getFeaturedArtworks(): Artwork[] {
  return getAllArtworks().filter((art) => art.featured);
}

export function getArtworkById(id: string): Artwork | undefined {
  return getAllArtworks().find((art) => art.id === id);
}

export function getArtworksByCategory(category: ArtworkCategory): Artwork[] {
  return getAllArtworks().filter((art) => art.category === category);
}

export function getArtworksByCollection(slug: string): Artwork[] {
  return getAllArtworks().filter((art) => art.collections?.includes(slug));
}

