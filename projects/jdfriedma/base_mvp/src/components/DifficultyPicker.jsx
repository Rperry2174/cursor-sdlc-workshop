import { DIFFICULTY_IDS } from '../data/passages.js'

const LABELS = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

export default function DifficultyPicker({ value, onChange }) {
  return (
    <fieldset className="difficulty-picker">
      <legend className="difficulty-legend">Difficulty</legend>
      <div className="difficulty-options" role="presentation">
        {DIFFICULTY_IDS.map((id) => {
          const selected = value === id
          return (
            <label
              key={id}
              className={`difficulty-option${selected ? ' difficulty-option--selected' : ''}`}
            >
              <input
                className="difficulty-input"
                type="radio"
                name="typing-difficulty"
                value={id}
                checked={selected}
                onChange={() => onChange(id)}
              />
              <span className="difficulty-label">{LABELS[id]}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
