import { useState } from "react";
import { TOPS, BOTTOMS, SHOES } from "./data/wardrobe";
import AboutUs from "./components/AboutUs";
import "./App.css";

// Eagerly import all clothing SVGs so Vite resolves their URLs
const svgModules = import.meta.glob("./assets/clothing/**/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

// Resolve an image slug (e.g. "tops/white-tshirt") to its Vite-processed URL
function getImageUrl(slug) {
  const key = `./assets/clothing/${slug}.svg`;
  return svgModules[key] || "";
}

// Helper: pick a random item from an array
function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function App() {
  // The current outfit — one top, one bottom, one pair of shoes
  const [outfit, setOutfit] = useState(null);
  // Toggle between main app and About Us page
  const [showAbout, setShowAbout] = useState(false);

  // Generate a random outfit by picking one from each category
  const generateOutfit = () => {
    setOutfit({
      top: pickRandom(TOPS),
      bottom: pickRandom(BOTTOMS),
      shoes: pickRandom(SHOES),
    });
  };

  // Show About Us page
  if (showAbout) {
    return <AboutUs onBack={() => setShowAbout(false)} />;
  }

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
              <img
                className="outfit-image"
                src={getImageUrl(outfit.top.image)}
                alt={outfit.top.name}
              />
              <span className="outfit-label">{outfit.top.name}</span>
            </div>

            {/* Bottom */}
            <div className="outfit-slot">
              <img
                className="outfit-image"
                src={getImageUrl(outfit.bottom.image)}
                alt={outfit.bottom.name}
              />
              <span className="outfit-label">{outfit.bottom.name}</span>
            </div>

            {/* Shoes */}
            <div className="outfit-slot">
              <img
                className="outfit-image"
                src={getImageUrl(outfit.shoes.image)}
                alt={outfit.shoes.name}
              />
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

      {/* Footer with About Us Link */}
      <footer className="app-footer">
        <button className="about-link" onClick={() => setShowAbout(true)}>
          About Us
        </button>
        <p className="footer-tagline">AI-Powered Style for Every Occasion</p>
      </footer>
    </div>
  );
}

export default App;
