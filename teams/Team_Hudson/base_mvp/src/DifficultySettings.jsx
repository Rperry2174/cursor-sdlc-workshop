import './DifficultySettings.css'

export const DIFFICULTY_CONFIGS = {
  easy: {
    spawnIntervalMs: 2000,
    scrollSpeed: 2,
    maxIcebergs: 3,
    label: 'Easy',
  },
  medium: {
    spawnIntervalMs: 1200,
    scrollSpeed: 3.5,
    maxIcebergs: 5,
    label: 'Medium',
  },
  hard: {
    spawnIntervalMs: 700,
    scrollSpeed: 5,
    maxIcebergs: 8,
    label: 'Hard',
  },
}

export default function DifficultySettings({ selected, onChange }) {
  return (
    <div className="difficulty-settings">
      <span className="difficulty-label">Difficulty:</span>
      <div className="difficulty-buttons">
        {Object.entries(DIFFICULTY_CONFIGS).map(([key, config]) => (
          <button
            key={key}
            type="button"
            className={`difficulty-btn ${selected === key ? 'selected' : ''}`}
            onClick={() => onChange(key)}
          >
            {config.label}
          </button>
        ))}
      </div>
    </div>
  )
}
