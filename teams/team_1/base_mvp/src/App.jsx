import { useState } from "react";
import { TOPS, BOTTOMS, SHOES } from "./data/wardrobe";
import "./App.css";

// Helper: pick a random item from an array
function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function App() {
  // The current outfit — one top, one bottom, one pair of shoes
  const [outfit, setOutfit] = useState(null);

  // Generate a random outfit by picking one from each category
  const generateOutfit = () => {
    setOutfit({
      top: pickRandom(TOPS),
      bottom: pickRandom(BOTTOMS),
      shoes: pickRandom(SHOES),
    });
  };

  return (
    <div className="app">
      {/* Header */}
      <h1 className="app-title">Wardrobe Generator</h1>
      <p className="app-subtitle">Click the button to generate a random outfit!</p>

      {/* --- Feature slots will plug in here (filters, palettes, etc.) --- */}

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
