import { useState } from 'react';
import PropertyCard from './components/PropertyCard';
import ResultsScreen from './components/ResultsScreen';
import properties from './data/properties';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState([]);
  const [decision, setDecision] = useState(null); // 'like' | 'skip' | null

  const isFinished = currentIndex >= properties.length;
  const currentProperty = properties[currentIndex];

  function handleDecision(type) {
    setDecision(type);

    setTimeout(() => {
      if (type === 'like') {
        setLiked((prev) => [...prev, currentProperty]);
      }
      setCurrentIndex((prev) => prev + 1);
      setDecision(null);
    }, 300);
  }

  function handleReset() {
    setCurrentIndex(0);
    setLiked([]);
    setDecision(null);
  }

  if (isFinished) {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="logo">ManxPad</h1>
          <p className="tagline">Isle of Man Property Swiper</p>
        </header>

        <ResultsScreen liked={liked} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="logo">ManxPad</h1>
        <p className="tagline">Isle of Man Property Swiper</p>
      </header>

      <div className="progress">
        {currentIndex + 1} of {properties.length}
      </div>

      <div className="card-area">
        <div
          className={`card-wrapper ${
            decision === 'like'
              ? 'swipe-right'
              : decision === 'skip'
              ? 'swipe-left'
              : ''
          }`}
        >
          {decision === 'like' && <div className="decision-overlay like-overlay">LIKED</div>}
          {decision === 'skip' && <div className="decision-overlay skip-overlay">NOPE</div>}
          <PropertyCard property={currentProperty} />
        </div>
      </div>

      <div className="actions">
        <button
          className="btn btn-skip"
          onClick={() => handleDecision('skip')}
          disabled={decision !== null}
        >
          Skip
        </button>
        <button
          className="btn btn-like"
          onClick={() => handleDecision('like')}
          disabled={decision !== null}
        >
          Like
        </button>
      </div>
    </div>
  );
}

export default App;
