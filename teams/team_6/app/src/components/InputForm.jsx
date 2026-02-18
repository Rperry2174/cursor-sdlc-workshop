import { useState } from 'react'

const COMMON_TASKS = [
  'Answered emails',
  '30 min workout',
  'Deep work block',
  'Meeting',
  'Shipped a feature',
  'Code review',
  'Documentation',
  '1:1',
]

export default function InputForm({ onAddItem, items }) {
  const [input, setInput] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const text = input.trim()
    if (text) {
      onAddItem(text)
      setInput('')
    }
  }

  function handleQuickAdd(label) {
    onAddItem(label)
  }

  return (
    <section className="input-form" aria-label="Add what you did today">
      <h2>What did you do today?</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Shipped feature X, 30 min workout…"
          aria-label="New accomplishment"
        />
        <button type="submit">Add item</button>
      </form>
      <div className="quick-add">
        <span className="quick-add-label">Quick add:</span>
        <div className="quick-add-buttons">
          {COMMON_TASKS.map((label) => (
            <button
              key={label}
              type="button"
              className="quick-add-btn"
              onClick={() => handleQuickAdd(label)}
              aria-label={`Add ${label}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {items.length > 0 && (
        <p className="input-hint">{items.length} item{items.length === 1 ? '' : 's'} added</p>
      )}
    </section>
  )
}
