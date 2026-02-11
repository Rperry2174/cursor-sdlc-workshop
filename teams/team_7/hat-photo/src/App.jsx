import { useState } from 'react'
import HatControls from './components/HatControls'
import './App.css'

function App() {
  const [photoUrl, setPhotoUrl] = useState(null)
  const [hatPosition, setHatPosition] = useState({ top: 5, left: 50 })
  const [hatSize, setHatSize] = useState(150)
  const [activeHat, setActiveHat] = useState('/hats/baseball-cap.svg')

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPhotoUrl(url)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Hat Try-On</h1>
        <p>Upload a photo and try on hats. Use the sliders to position the hat on your head.</p>
      </header>

      <div className="upload-section">
        <label className="upload-btn">
          {photoUrl ? 'Change Photo' : 'Upload Photo'}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            hidden
          />
        </label>
      </div>

      <div className="preview-area">
        {photoUrl ? (
          <div className="photo-container">
            <img src={photoUrl} alt="Your photo" className="photo" />
            <img
              src={activeHat}
              alt="Hat"
              className="hat-overlay"
              style={{
                top: `${hatPosition.top}%`,
                left: `${hatPosition.left}%`,
                width: hatSize,
                transform: `translate(-50%, -50%)`,
              }}
            />
          </div>
        ) : (
          <div className="placeholder">
            <p>Upload a photo to get started</p>
          </div>
        )}

        {photoUrl && (
          <HatControls
            hatPosition={hatPosition}
            onPositionChange={setHatPosition}
            hatSize={hatSize}
            onSizeChange={setHatSize}
            activeHat={activeHat}
            onHatChange={setActiveHat}
          />
        )}
      </div>

      <div className="hat-selector">
        <h3>Choose a hat</h3>
        <div className="hat-buttons">
          <button
            className={activeHat === '/hats/baseball-cap.svg' ? 'active' : ''}
            onClick={() => setActiveHat('/hats/baseball-cap.svg')}
          >
            Baseball cap
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
