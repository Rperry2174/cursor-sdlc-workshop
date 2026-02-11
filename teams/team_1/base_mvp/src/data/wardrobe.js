// wardrobe.js — All clothing data lives here.
// Each item has a name, emoji, color, image path, and tags array.
// Tags are used by features like season filters and occasion selectors.

import whiteTshirt from "../assets/clothing/tops/white-tshirt.svg";
import blackHoodie from "../assets/clothing/tops/black-hoodie.svg";
import blazer from "../assets/clothing/tops/blazer.svg";
import denimJacket from "../assets/clothing/tops/denim-jacket.svg";
import hawaiianShirt from "../assets/clothing/tops/hawaiian-shirt.svg";
import sweater from "../assets/clothing/tops/sweater.svg";
import poloShirt from "../assets/clothing/tops/polo-shirt.svg";
import tankTop from "../assets/clothing/tops/tank-top.svg";
import flannelShirt from "../assets/clothing/tops/flannel-shirt.svg";
import dressShirt from "../assets/clothing/tops/dress-shirt.svg";

import blueJeans from "../assets/clothing/bottoms/blue-jeans.svg";
import chinos from "../assets/clothing/bottoms/chinos.svg";
import blackTrousers from "../assets/clothing/bottoms/black-trousers.svg";
import cargoShorts from "../assets/clothing/bottoms/cargo-shorts.svg";
import athleticShorts from "../assets/clothing/bottoms/athletic-shorts.svg";
import joggers from "../assets/clothing/bottoms/joggers.svg";
import skirt from "../assets/clothing/bottoms/skirt.svg";
import corduroyPants from "../assets/clothing/bottoms/corduroy-pants.svg";

import whiteSneakers from "../assets/clothing/shoes/white-sneakers.svg";
import blackBoots from "../assets/clothing/shoes/black-boots.svg";
import loafers from "../assets/clothing/shoes/loafers.svg";
import sandals from "../assets/clothing/shoes/sandals.svg";
import runningShoes from "../assets/clothing/shoes/running-shoes.svg";
import highHeels from "../assets/clothing/shoes/high-heels.svg";
import canvasShoes from "../assets/clothing/shoes/canvas-shoes.svg";
import hikingBoots from "../assets/clothing/shoes/hiking-boots.svg";

export const TOPS = [
  { name: "White T-Shirt", emoji: "👕", color: "white", image: whiteTshirt, tags: ["summer", "spring", "casual", "sport"] },
  { name: "Black Hoodie", emoji: "🧥", color: "black", image: blackHoodie, tags: ["winter", "fall", "casual"] },
  { name: "Blazer", emoji: "🧥", color: "navy", image: blazer, tags: ["fall", "spring", "work", "party"] },
  { name: "Denim Jacket", emoji: "🧥", color: "blue", image: denimJacket, tags: ["spring", "fall", "casual"] },
  { name: "Hawaiian Shirt", emoji: "👕", color: "red", image: hawaiianShirt, tags: ["summer", "casual", "party"] },
  { name: "Sweater", emoji: "🧶", color: "green", image: sweater, tags: ["winter", "fall", "casual", "work"] },
  { name: "Polo Shirt", emoji: "👕", color: "navy", image: poloShirt, tags: ["summer", "spring", "work", "casual"] },
  { name: "Tank Top", emoji: "🎽", color: "white", image: tankTop, tags: ["summer", "casual", "sport"] },
  { name: "Flannel Shirt", emoji: "👕", color: "red", image: flannelShirt, tags: ["fall", "winter", "casual"] },
  { name: "Dress Shirt", emoji: "👔", color: "white", image: dressShirt, tags: ["spring", "fall", "work", "party"] },
];

export const BOTTOMS = [
  { name: "Blue Jeans", emoji: "👖", color: "blue", image: blueJeans, tags: ["winter", "fall", "spring", "casual"] },
  { name: "Chinos", emoji: "👖", color: "khaki", image: chinos, tags: ["spring", "fall", "work", "casual"] },
  { name: "Black Trousers", emoji: "👖", color: "black", image: blackTrousers, tags: ["winter", "fall", "work", "party"] },
  { name: "Cargo Shorts", emoji: "🩳", color: "green", image: cargoShorts, tags: ["summer", "casual", "sport"] },
  { name: "Athletic Shorts", emoji: "🩳", color: "black", image: athleticShorts, tags: ["summer", "spring", "sport", "casual"] },
  { name: "Joggers", emoji: "👖", color: "gray", image: joggers, tags: ["fall", "winter", "casual", "sport"] },
  { name: "Skirt", emoji: "👗", color: "pink", image: skirt, tags: ["summer", "spring", "casual", "party"] },
  { name: "Corduroy Pants", emoji: "👖", color: "brown", image: corduroyPants, tags: ["fall", "winter", "casual", "work"] },
];

export const SHOES = [
  { name: "White Sneakers", emoji: "👟", color: "white", image: whiteSneakers, tags: ["summer", "spring", "casual", "sport"] },
  { name: "Black Boots", emoji: "🥾", color: "black", image: blackBoots, tags: ["winter", "fall", "casual", "work"] },
  { name: "Loafers", emoji: "👞", color: "brown", image: loafers, tags: ["spring", "fall", "work", "party"] },
  { name: "Sandals", emoji: "🩴", color: "brown", image: sandals, tags: ["summer", "casual"] },
  { name: "Running Shoes", emoji: "👟", color: "blue", image: runningShoes, tags: ["summer", "spring", "sport"] },
  { name: "High Heels", emoji: "👠", color: "red", image: highHeels, tags: ["spring", "fall", "party", "work"] },
  { name: "Canvas Shoes", emoji: "👟", color: "navy", image: canvasShoes, tags: ["summer", "spring", "casual"] },
  { name: "Hiking Boots", emoji: "🥾", color: "brown", image: hikingBoots, tags: ["fall", "winter", "sport", "casual"] },
];
