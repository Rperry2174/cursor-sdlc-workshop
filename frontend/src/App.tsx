import { useCallback, useEffect, useState } from 'react'
import { api, type TranslateDirection } from './api/client'

const DEBOUNCE_MS = 400

function App() {
  const [input, setInput] = useState('')
  const [direction, setDirection] = useState<TranslateDirection>('la_en')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runTranslate = useCallback(async (text: string, dir: TranslateDirection) => {
    const trimmed = text.trim()
    if (!trimmed) {
      setOutput('')
      setLoading(false)
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await api.translate(trimmed, dir)
      setOutput(res.translated_text)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Translation failed')
      setOutput('')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => {
      runTranslate(input, direction)
    }, DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [input, direction, runTranslate])

  const inputLabel = direction === 'la_en' ? 'Latin' : 'English'
  const outputLabel = direction === 'la_en' ? 'English' : 'Latin'

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Via Verborum</h1>
        <p className="subtitle">Latin ↔ English</p>
      </header>

      <div className="direction-row">
        <button
          type="button"
          className={`direction-btn ${direction === 'la_en' ? 'active' : ''}`}
          onClick={() => setDirection('la_en')}
          aria-pressed={direction === 'la_en'}
        >
          Latin → English
        </button>
        <button
          type="button"
          className={`direction-btn ${direction === 'en_la' ? 'active' : ''}`}
          onClick={() => setDirection('en_la')}
          aria-pressed={direction === 'en_la'}
        >
          English → Latin
        </button>
      </div>

      <div className="panels">
        <section className="panel panel-input">
          <label className="panel-label" htmlFor="input-text">
            {inputLabel}
          </label>
          <textarea
            id="input-text"
            className="panel-textarea"
            placeholder={
              direction === 'la_en'
                ? 'e.g. Salve, mundi'
                : 'e.g. Hello, world'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={direction === 'en_la'}
            rows={8}
            aria-describedby="output-hint"
          />
        </section>

        <section className="panel panel-output" aria-live="polite" id="output-hint">
          <span className="panel-label">{outputLabel}</span>
          <div className="panel-output-content">
            {loading && <p className="output-loading">Translating…</p>}
            {error && <p className="output-error">{error}</p>}
            {!loading && !error && (
              <p className="output-text">{output || '—'}</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
