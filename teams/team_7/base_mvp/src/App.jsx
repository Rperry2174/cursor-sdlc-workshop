import { useState } from 'react';
import HatGallery from './components/HatGallery';
import { hats } from './data/hats';
import './App.css';

function App() {
  const [selectedHat, setSelectedHat] = useState(null);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHatSelect = (hatId) => {
    setSelectedHat(hatId);
  };

  const selectedHatData = hats.find(hat => hat.id === selectedHat);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Hat Try-On</h1>
        <p>Upload a photo and try on different hats!</p>
      </header>

      <main className="app-main">
        <div className="upload-section">
          <label htmlFor="photo-upload" className="upload-label">
            Upload Photo
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="upload-input"
          />
        </div>

        <div className="preview-section">
          {uploadedPhoto ? (
            <div className="photo-container">
              <img src={uploadedPhoto} alt="Uploaded" className="uploaded-photo" />
              {selectedHatData && (
                <img
                  src={selectedHatData.imagePath}
                  alt={selectedHatData.name}
                  className="hat-overlay"
                />
              )}
            </div>
          ) : (
            <div className="placeholder">
              <p>Upload a photo to get started</p>
            </div>
          )}
        </div>

        <HatGallery
          hats={hats}
          selectedHatId={selectedHat}
          onHatSelect={handleHatSelect}
        />
      </main>
    </div>
  );
}

export default App;
