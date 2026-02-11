import "./SavedOutfits.css";

/**
 * Generates a deterministic key for an outfit based on item names.
 * Used for list keys and duplicate detection.
 */
export function outfitKey(outfit) {
  return `${outfit.top.name}|${outfit.bottom.name}|${outfit.shoes.name}`;
}

function SavedOutfits({ savedOutfits, onSelectOutfit, onRemoveOutfit }) {
  if (!savedOutfits || savedOutfits.length === 0) {
    return (
      <div className="saved-outfits-empty">
        <span className="saved-outfits-empty-icon">📂</span>
        <p>No saved outfits yet — hit the heart to save one!</p>
      </div>
    );
  }

  return (
    <div className="saved-outfits">
      <h3 className="saved-outfits-title">Saved Outfits</h3>
      <div className="saved-outfits-strip">
        {savedOutfits.map((outfit) => {
          const key = outfitKey(outfit);
          return (
            <button
              key={key}
              className="saved-outfit-card"
              onClick={() => onSelectOutfit(outfit)}
              title={`${outfit.top.name}, ${outfit.bottom.name}, ${outfit.shoes.name}`}
            >
              <span className="saved-outfit-emojis">
                <span>{outfit.top.emoji}</span>
                <span>{outfit.bottom.emoji}</span>
                <span>{outfit.shoes.emoji}</span>
              </span>
              <button
                className="saved-outfit-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveOutfit(key);
                }}
                aria-label="Remove saved outfit"
              >
                ✕
              </button>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SavedOutfits;
