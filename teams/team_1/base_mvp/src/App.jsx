import { useState } from "react";
import { TOPS, BOTTOMS, SHOES } from "./data/wardrobe";
import OccasionSelector from "./components/OccasionSelector";
import "./App.css";

// Helper: pick a random item from an array
function pickRandom(array) {
  if (array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}

// Helper: filter items by occasion tag; fallback to full array if none match
function filterByOccasion(items, occasion) {
  if (!occasion) return items;
  const filtered = items.filter((item) => item.tags.includes(occasion));
  return filtered.length > 0 ? filtered : items;
}

function App() {
  // The current outfit — one top, one bottom, one pair of shoes
  const [outfit, setOutfit] = useState(null);
  const [selectedOccasion, setSelectedOccasion] = useState(null);

  // Generate a random outfit by picking one from each category (filtered by occasion when set)
  const generateOutfit = () => {
    const tops = filterByOccasion(TOPS, selectedOccasion);
    const bottoms = filterByOccasion(BOTTOMS, selectedOccasion);
    const shoes = filterByOccasion(SHOES, selectedOccasion);
    const top = pickRandom(tops);
    const bottom = pickRandom(bottoms);
    const shoe = pickRandom(shoes);
    if (top && bottom && shoe) {
      setOutfit({ top, bottom, shoes: shoe });
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <h1 className="app-title">Wardrobe Generator</h1>
      <p className="app-subtitle">Click the button to generate a random outfit!</p>

      {/* --- Feature slots will plug in here (filters, palettes, etc.) --- */}
      <OccasionSelector selectedOccasion={selectedOccasion} onChange={setSelectedOccasion} />

      {/* Outfit Card */}
      <div className="outfit-card">
        {outfit ? (
          <>
            {/* Top */}
            <div className="outfit-slot">
              <span className="outfit-emoji">{outfit.top.emoji}</span>
              <span className="outfit-label">{outfit.top.name}</span>
            </div>

            {/* Bottom */}
            <div className="outfit-slot">
              <span className="outfit-emoji">{outfit.bottom.emoji}</span>
              <span className="outfit-label">{outfit.bottom.name}</span>
            </div>

            {/* Shoes */}
            <div className="outfit-slot">
              <span className="outfit-emoji">{outfit.shoes.emoji}</span>
              <span className="outfit-label">{outfit.shoes.name}</span>
            </div>
          </>
        ) : (
          <p className="outfit-placeholder">
            No outfit yet — hit the button below!
          </p>
        )}
      </div>

      {/* Generate Button */}
      <button className="generate-btn" onClick={generateOutfit}>
        Generate Outfit
      </button>

      {/* --- Feature slots will plug in here (history, saved outfits, etc.) --- */}
    </div>
  );
}

export default App;
