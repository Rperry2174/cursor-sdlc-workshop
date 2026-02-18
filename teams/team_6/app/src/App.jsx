import { useState } from 'react'
import { calculateScore } from './utils/score'
import InputForm from './components/InputForm'
import ScoreDisplay from './components/ScoreDisplay'
import ScoreBreakdown from './components/ScoreBreakdown'
import ScoreGauge from './components/ScoreGauge'
import SummaryList from './components/SummaryList'
import EmailScore from './components/EmailScore'
import './App.css'

export default function App() {
  const [items, setItems] = useState([])
  const [result, setResult] = useState(null)

  function handleAddItem(text) {
    setItems((prev) => [...prev, text])
    setResult(null)
  }

  function handleRemoveItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index))
    setResult(null)
  }

  function handleCalculate() {
    const res = calculateScore(items)
    setResult(res)
  }

  return (
    <div className="app">
      <header>
        <h1>Daily Productivity Tracker</h1>
        <p className="tagline">Log what you did. Get a score.</p>
      </header>

      <main>
        <InputForm onAddItem={handleAddItem} items={items} />

        <div className="actions">
          <button type="button" className="primary" onClick={handleCalculate} disabled={items.length === 0}>
            Get my score
          </button>
        </div>

        {result && (
          <div className="results">
            <ScoreDisplay score={result.score} letterGrade={result.letterGrade} />
            <ScoreGauge score={result.score} />
            <ScoreBreakdown breakdown={result.breakdown} />
          </div>
        )}

        <EmailScore />

        <SummaryList items={items} onRemove={handleRemoveItem} />
      </main>
    </div>
  )
}
