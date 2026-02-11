import { useState } from 'react'
import './App.css'
import CompareView from './components/CompareView'

const HAT_TYPES = [
  '/hats/hat-1.png',
  '/hats/hat-2.png',
  '/hats/hat-3.png',
  '/hats/hat-4.png',
  '/hats/hat-5.png',
  '/hats/hat-6.png',
]

function randomOffset() {
  return Math.floor(Math.random() * 41) - 20 // -20 to +20
}

function App() {
  const [hats, setHats] = useState([])
  const [compareMode, setCompareMode] = useState(false)

  const addHat = () => {
    const newHat = {
      id: Date.now(),
      type: hats.length % HAT_TYPES.length,
      offsetX: randomOffset(),
      offsetY: randomOffset(),
    }
    setHats((prev) => [...prev, newHat])
  }

  const resetHats = () => setHats([])

  return (
    <div className="app">
      <h1>Hat Photo</h1>
      <div className="controls">
        <button
          type="button"
          onClick={() => setCompareMode((c) => !c)}
          className={compareMode ? 'btn-reset' : 'btn-add'}
        >
          {compareMode ? 'Single view' : 'Compare view'}
        </button>
      </div>
      {compareMode ? (
        <CompareView
          photoUrl="/photo.png"
          hats={hats}
          hatTypes={HAT_TYPES}
        />
      ) : (
        <>
          <div className="photo-container">
            <img src="/photo.png" alt="Photo" className="photo" />
            <div className="hat-overlay">
              {hats.map((hat) => (
                <img
                  key={hat.id}
                  src={HAT_TYPES[hat.type]}
                  alt="Hat"
                  className="hat"
                  style={{
                    left: `calc(50% + ${hat.offsetX}px)`,
                    top: `calc(28% + ${hat.offsetY}px)`,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="controls">
            <button onClick={addHat} className="btn-add">
              Add a hat
            </button>
            <button onClick={resetHats} className="btn-reset">
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default App
