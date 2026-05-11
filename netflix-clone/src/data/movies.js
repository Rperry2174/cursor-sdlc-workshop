// Stub movie data — no database or API needed.
// Colors are used as gradient backgrounds since we can't fetch external images.
export const FEATURED = {
  title: "Stranger Things",
  description:
    "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one very strange little girl.",
  gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #e94560 100%)",
};

const PALETTES = [
  ["#e94560", "#0f3460"],
  ["#533483", "#0b8457"],
  ["#f97316", "#1e1b4b"],
  ["#06b6d4", "#1e3a5f"],
  ["#8b5cf6", "#1f2937"],
  ["#ec4899", "#312e81"],
  ["#10b981", "#1e293b"],
  ["#f59e0b", "#1e1b4b"],
];

function gradient(id) {
  const [a, b] = PALETTES[(id - 1) % PALETTES.length];
  return `linear-gradient(135deg, ${b} 0%, ${a} 100%)`;
}

export const CATEGORIES = [
  {
    title: "Trending Now",
    movies: [
      { id: 1, title: "The Night Agent", bg: gradient(1) },
      { id: 2, title: "Wednesday", bg: gradient(2) },
      { id: 3, title: "Glass Onion", bg: gradient(3) },
      { id: 4, title: "All Quiet on the Western Front", bg: gradient(4) },
      { id: 5, title: "Enola Holmes 2", bg: gradient(5) },
      { id: 6, title: "The Watcher", bg: gradient(6) },
      { id: 7, title: "Dahmer", bg: gradient(7) },
      { id: 8, title: "Do Revenge", bg: gradient(8) },
    ],
  },
  {
    title: "Popular on Netflix",
    movies: [
      { id: 9, title: "Squid Game", bg: gradient(9) },
      { id: 10, title: "Money Heist", bg: gradient(10) },
      { id: 11, title: "Dark", bg: gradient(11) },
      { id: 12, title: "Ozark", bg: gradient(12) },
      { id: 13, title: "The Crown", bg: gradient(13) },
      { id: 14, title: "Bridgerton", bg: gradient(14) },
      { id: 15, title: "Lupin", bg: gradient(15) },
      { id: 16, title: "Cobra Kai", bg: gradient(16) },
    ],
  },
  {
    title: "Top Rated",
    movies: [
      { id: 17, title: "Breaking Bad", bg: gradient(17) },
      { id: 18, title: "Better Call Saul", bg: gradient(18) },
      { id: 19, title: "Peaky Blinders", bg: gradient(19) },
      { id: 20, title: "Narcos", bg: gradient(20) },
      { id: 21, title: "Black Mirror", bg: gradient(21) },
      { id: 22, title: "Mindhunter", bg: gradient(22) },
      { id: 23, title: "The Witcher", bg: gradient(23) },
      { id: 24, title: "You", bg: gradient(24) },
    ],
  },
  {
    title: "My List",
    movies: [
      { id: 25, title: "The Queen's Gambit", bg: gradient(25) },
      { id: 26, title: "Arcane", bg: gradient(26) },
      { id: 27, title: "The Sandman", bg: gradient(27) },
      { id: 28, title: "Heartstopper", bg: gradient(28) },
      { id: 29, title: "Alice in Borderland", bg: gradient(29) },
      { id: 30, title: "Behind Her Eyes", bg: gradient(30) },
      { id: 31, title: "Shadow and Bone", bg: gradient(31) },
      { id: 32, title: "Sweet Tooth", bg: gradient(32) },
    ],
  },
];
