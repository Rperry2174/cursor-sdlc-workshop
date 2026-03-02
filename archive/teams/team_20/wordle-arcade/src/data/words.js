const WORDS = [
  "CRANE", "SLATE", "TRACE", "CRATE", "STARE",
  "SNARE", "BLAZE", "GRACE", "GRIPE", "FLAME",
  "PLUMB", "JOLLY", "QUIRK", "VIVID", "WALTZ",
  "PIXEL", "JOKER", "FROZE", "GLYPH", "DWARF",
  "BLITZ", "CHUNK", "FLINT", "GHOST", "HAVEN",
  "KNELT", "LUNAR", "MAPLE", "NERVE", "OLIVE",
  "PRISM", "QUILT", "ROVER", "SHARK", "THORN",
  "ULTRA", "VENOM", "WHEAT", "YIELD", "ZESTY",
  "BRAVE", "CHARM", "DRIFT", "EAGLE", "FUNGI",
  "GLOBE", "HASTE", "IVORY", "JEWEL", "KAYAK",
  "LEMON", "MANGO", "NOBLE", "OCEAN", "PEARL",
  "REIGN", "SOLAR", "TIGER", "UNITY", "VAPOR",
  "BOXER", "CYNIC", "DECAY", "ERUPT", "FEAST",
  "GRASP", "HUMID", "IRONY", "JAZZY", "KNACK",
  "LEAPT", "MIGHT", "NIFTY", "ORBIT", "PLUCK",
  "QUEST", "RADAR", "SPICY", "TOXIN", "UMBRA",
  "VIBES", "WITCH", "YOUTH", "ABODE", "BRINE",
  "CLASP", "DODGE", "EMBER", "FROST", "GUSTO",
  "HATCH", "INEPT", "JUMBO", "LLAMA", "MOOSE",
  "NOVEL", "OUNCE", "PANIC", "RAPID", "SAUNA",
];

export function getRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export default WORDS;
