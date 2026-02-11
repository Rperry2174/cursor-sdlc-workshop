// wardrobe.js — All clothing data lives here.
// Each item has a name, image (SVG path slug), color, and tags array.
// Tags are used by features like season filters and occasion selectors.

export const TOPS = [
  { name: "White T-Shirt", image: "tops/white-tshirt", color: "white", tags: ["summer", "spring", "casual", "sport"] },
  { name: "Black Hoodie", image: "tops/black-hoodie", color: "black", tags: ["winter", "fall", "casual"] },
  { name: "Blazer", image: "tops/blazer", color: "navy", tags: ["fall", "spring", "work", "party"] },
  { name: "Denim Jacket", image: "tops/denim-jacket", color: "blue", tags: ["spring", "fall", "casual"] },
  { name: "Hawaiian Shirt", image: "tops/hawaiian-shirt", color: "red", tags: ["summer", "casual", "party"] },
  { name: "Sweater", image: "tops/sweater", color: "green", tags: ["winter", "fall", "casual", "work"] },
  { name: "Polo Shirt", image: "tops/polo-shirt", color: "navy", tags: ["summer", "spring", "work", "casual"] },
  { name: "Tank Top", image: "tops/tank-top", color: "white", tags: ["summer", "casual", "sport"] },
  { name: "Flannel Shirt", image: "tops/flannel-shirt", color: "red", tags: ["fall", "winter", "casual"] },
  { name: "Dress Shirt", image: "tops/dress-shirt", color: "white", tags: ["spring", "fall", "work", "party"] },
];

export const BOTTOMS = [
  { name: "Blue Jeans", image: "bottoms/blue-jeans", color: "blue", tags: ["winter", "fall", "spring", "casual"] },
  { name: "Chinos", image: "bottoms/chinos", color: "khaki", tags: ["spring", "fall", "work", "casual"] },
  { name: "Black Trousers", image: "bottoms/black-trousers", color: "black", tags: ["winter", "fall", "work", "party"] },
  { name: "Cargo Shorts", image: "bottoms/cargo-shorts", color: "green", tags: ["summer", "casual", "sport"] },
  { name: "Athletic Shorts", image: "bottoms/athletic-shorts", color: "black", tags: ["summer", "spring", "sport", "casual"] },
  { name: "Joggers", image: "bottoms/joggers", color: "gray", tags: ["fall", "winter", "casual", "sport"] },
  { name: "Skirt", image: "bottoms/skirt", color: "pink", tags: ["summer", "spring", "casual", "party"] },
  { name: "Corduroy Pants", image: "bottoms/corduroy-pants", color: "brown", tags: ["fall", "winter", "casual", "work"] },
];

export const SHOES = [
  { name: "White Sneakers", image: "shoes/white-sneakers", color: "white", tags: ["summer", "spring", "casual", "sport"] },
  { name: "Black Boots", image: "shoes/black-boots", color: "black", tags: ["winter", "fall", "casual", "work"] },
  { name: "Loafers", image: "shoes/loafers", color: "brown", tags: ["spring", "fall", "work", "party"] },
  { name: "Sandals", image: "shoes/sandals", color: "brown", tags: ["summer", "casual"] },
  { name: "Running Shoes", image: "shoes/running-shoes", color: "blue", tags: ["summer", "spring", "sport"] },
  { name: "High Heels", image: "shoes/high-heels", color: "red", tags: ["spring", "fall", "party", "work"] },
  { name: "Canvas Shoes", image: "shoes/canvas-shoes", color: "navy", tags: ["summer", "spring", "casual"] },
  { name: "Hiking Boots", image: "shoes/hiking-boots", color: "brown", tags: ["fall", "winter", "sport", "casual"] },
];
