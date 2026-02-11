import './HatGallery.css';

function HatGallery({ hats, selectedHatId, onHatSelect }) {
  return (
    <div className="hat-gallery" role="region" aria-label="Hat gallery">
      <h3 className="hat-gallery-title">Choose a Hat</h3>
      <div className="hat-gallery-grid">
        {hats.map((hat) => (
          <button
            key={hat.id}
            className={`hat-item ${selectedHatId === hat.id ? 'selected' : ''}`}
            onClick={() => onHatSelect(hat.id)}
            aria-label={`Select hat: ${hat.name}`}
            aria-pressed={selectedHatId === hat.id}
          >
            <img
              src={hat.imagePath}
              alt={hat.name}
              className="hat-thumbnail"
            />
            <span className="hat-name">{hat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HatGallery;
