import { useState, useEffect } from "react";
import { TOPS, BOTTOMS, SHOES } from "./data/wardrobe";
import SavedOutfits, { outfitKey } from "./components/SavedOutfits";
import "./App.css";

const STORAGE_KEY = "wardrobe.savedOutfits.v1";

// Helper: pick a random item from an array
function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Safe localStorage read
function loadSavedOutfits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function App() {
  // The current outfit — one top, one bottom, one pair of shoes
  const [outfit, setOutfit] = useState(null);

  // Saved outfits — initialized from localStorage
  const [savedOutfits, setSavedOutfits] = useState(loadSavedOutfits);

  // Persist saved outfits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedOutfits));
  }, [savedOutfits]);

  // Generate a random outfit by picking one from each category
  const generateOutfit = () => {
    setOutfit({
      top: pickRandom(TOPS),
      bottom: pickRandom(BOTTOMS),
      shoes: pickRandom(SHOES),
    });
  };

  // Save current outfit (prevent duplicates by key)
  const handleSaveOutfit = () => {
    if (!outfit) return;
    const key = outfitKey(outfit);
    const alreadySaved = savedOutfits.some((o) => outfitKey(o) === key);
    if (alreadySaved) return;
    setSavedOutfits((prev) => [...prev, outfit]);
  };

  // Remove a saved outfit by its key
  const handleRemoveOutfit = (keyToRemove) => {
    setSavedOutfits((prev) =>
      prev.filter((o) => outfitKey(o) !== keyToRemove)
    );
  };

  // Load a saved outfit into the main display
  const handleSelectOutfit = (selectedOutfit) => {
    setOutfit(selectedOutfit);
  };

  // Check if current outfit is already saved
  const isCurrentOutfitSaved =
    outfit && savedOutfits.some((o) => outfitKey(o) === outfitKey(outfit));

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
            {/* Save Outfit Button */}
            <button
              className={`save-outfit-btn ${isCurrentOutfitSaved ? "saved" : ""}`}
              onClick={handleSaveOutfit}
              disabled={isCurrentOutfitSaved}
              title={isCurrentOutfitSaved ? "Outfit already saved" : "Save this outfit"}
              aria-label={isCurrentOutfitSaved ? "Outfit already saved" : "Save this outfit"}
            >
              {isCurrentOutfitSaved ? "♥" : "♡"}
            </button>

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

      {/* Saved Outfits Gallery */}
      <SavedOutfits
        savedOutfits={savedOutfits}
        onSelectOutfit={handleSelectOutfit}
        onRemoveOutfit={handleRemoveOutfit}
      />

      {/* --- Feature slots will plug in here (history, etc.) --- */}
    </div>
  );
}

export default App;
