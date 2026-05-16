import { useState, useRef, useEffect, useMemo } from 'react'
import {
  pickRandomPassage,
  DEFAULT_DIFFICULTY,
  CHARS_PER_WORD,
} from './data/passages.js'
import DifficultyPicker from './components/DifficultyPicker.jsx'
import WpmDisplay from './components/WpmDisplay.jsx'
import AccuracyTracker from './components/AccuracyTracker.jsx'
import MarvisMascot from './components/MarvisMascot.jsx'
import ResultsModal from './components/ResultsModal.jsx'
import {
  accuracyPercent,
  isPass,
} from './constants/results.js'
import './App.css'

/**
 * Split passage into words, spaces, and newlines so each word can be wrapped in
 * a non-breaking span — per-character spans otherwise allow line breaks mid-word.
 */
function segmentPassage(str) {
  const segments = []
  let i = 0
  while (i < str.length) {
    const ch = str[i]
    if (ch === '\n') {
      segments.push({ type: 'newline', index: i })
      i++
    } else if (ch === ' ') {
      segments.push({ type: 'space', index: i })
      i++
    } else {
      const start = i
      while (i < str.length && str[i] !== ' ' && str[i] !== '\n') i++
      segments.push({ type: 'word', start, end: i })
    }
  }
  return segments
}

export default function App() {
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY)
  const [passage, setPassage] = useState(() =>
    pickRandomPassage(DEFAULT_DIFFICULTY),
  )
  const [passageLayoutKey, setPassageLayoutKey] = useState(0)
  const [typed, setTyped] = useState('')
  const [correctForward, setCorrectForward] = useState(0)
  const [totalForward, setTotalForward] = useState(0)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const [sessionEndMs, setSessionEndMs] = useState(null)
  const [startTimeMs, setStartTimeMs] = useState(null)
  const [successCount, setSuccessCount] = useState(0)
  const [failureCount, setFailureCount] = useState(0)

  const inputRef = useRef(null)

  const finished = typed === passage && passage.length > 0

  const phase = useMemo(() => {
    if (finished) return 'done'
    if (typed.length > 0) return 'typing'
    return 'idle'
  }, [finished, typed.length])

  /** Drive live WPM updates without calling Date.now() during render. */
  useEffect(() => {
    const active = typed.length > 0 && !finished
    if (!active) return
    const tick = () => setNowMs(Date.now())
    tick()
    const id = setInterval(tick, 150)
    return () => clearInterval(id)
  }, [typed, finished])

  useEffect(() => {
    if (!finished) {
      inputRef.current?.focus()
    }
  }, [finished])

  function resetRunState() {
    setTyped('')
    setCorrectForward(0)
    setTotalForward(0)
    setStartTimeMs(null)
    setSessionEndMs(null)
    queueMicrotask(() => inputRef.current?.focus())
  }

  function bumpPassageLayout() {
    setPassageLayoutKey((k) => k + 1)
  }

  function handleDifficultyChange(next) {
    setDifficulty(next)
    setPassage(pickRandomPassage(next))
    bumpPassageLayout()
    resetRunState()
  }

  function handleReset() {
    setPassage(pickRandomPassage(difficulty))
    bumpPassageLayout()
    resetRunState()
  }

  function handleChange(e) {
    const next = e.target.value
    if (next.length > passage.length) return

    let nextCorrect = correctForward
    let nextTotal = totalForward
    if (next.length > typed.length) {
      for (let i = typed.length; i < next.length; i++) {
        nextTotal += 1
        if (next[i] === passage[i]) {
          nextCorrect += 1
        }
        setTotalForward((t) => t + 1)
        if (next[i] === passage[i]) {
          setCorrectForward((c) => c + 1)
        }
      }
    }

    let runStartMs = startTimeMs
    if (runStartMs == null && next.length > 0) {
      runStartMs = Date.now()
      setStartTimeMs(runStartMs)
    }
    if (typed.length > 0 && next.length === 0) {
      setStartTimeMs(null)
      runStartMs = null
    }

    setTyped(next)

    if (next === passage && passage.length > 0 && runStartMs != null) {
      const endMs = Date.now()
      setSessionEndMs((prev) => prev ?? endMs)
      const wpmFinal =
        (passage.length / CHARS_PER_WORD) / ((endMs - runStartMs) / 60_000)
      if (isPass(wpmFinal, nextCorrect, nextTotal)) {
        setSuccessCount((c) => c + 1)
      } else {
        setFailureCount((c) => c + 1)
      }
    } else if (next !== passage) {
      setSessionEndMs(null)
    }
  }

  const liveWpm =
    typed.length > 0 &&
    !finished &&
    startTimeMs != null
      ? (typed.length / CHARS_PER_WORD) /
        ((nowMs - startTimeMs) / 60_000)
      : null

  const finalWpm =
    finished &&
    sessionEndMs != null &&
    startTimeMs != null
      ? (passage.length / CHARS_PER_WORD) /
        ((sessionEndMs - startTimeMs) / 60_000)
      : null

  const finalAccuracyPct =
    finished && totalForward > 0
      ? accuracyPercent(correctForward, totalForward)
      : null

  const passed = Boolean(
    finished &&
      finalWpm != null &&
      isPass(finalWpm, correctForward, totalForward),
  )

  const passageSegments = useMemo(() => segmentPassage(passage), [passage])

  function glyphStatusClass(i, targetCh) {
    const isTyped = i < typed.length
    const isCursor = i === typed.length && !finished
    if (isTyped) return typed[i] === targetCh ? 'correct' : 'wrong'
    if (isCursor) return 'cursor-cell'
    return 'upcoming'
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Marvis Bacon Judges Typing</h1>
        <MarvisMascot />
        <p className="tagline">
          Retype the passage. Marvis is watching.
        </p>
      </header>

      <main className="main">
        <section className="board" aria-label="Typing feedback">
          {!finished && (
            <DifficultyPicker
              value={difficulty}
              onChange={handleDifficultyChange}
            />
          )}

          <div className="stats-row">
            <WpmDisplay
              phase={phase}
              liveWpm={liveWpm}
              finalWpm={finalWpm}
              charCountForWords={passage.length}
            />
            <AccuracyTracker
              correct={correctForward}
              total={totalForward}
              phase={phase}
            />
          </div>

          <div
            className={
              finished
                ? 'typing-workspace typing-workspace--finished'
                : 'typing-workspace'
            }
          >
            <div className="document-zone" aria-label="Reference passage">
              <p className="document-zone__eyebrow" aria-hidden="true">
                Reference file — read only
              </p>
              <div className="passage" role="presentation">
                {passageSegments.map((seg) => {
                  if (seg.type === 'newline') {
                    const i = seg.index
                    const statusClass = glyphStatusClass(i, passage[i])
                    return (
                      <span
                        key={`${passageLayoutKey}-${i}`}
                        className={`glyph glyph--newline ${statusClass}`}
                      >
                        <br />
                      </span>
                    )
                  }

                  if (seg.type === 'space') {
                    const i = seg.index
                    const statusClass = glyphStatusClass(i, passage[i])
                    return (
                      <span
                        key={`${passageLayoutKey}-${i}`}
                        className={`glyph ${statusClass}`}
                      >
                        {' '}
                      </span>
                    )
                  }

                  return (
                    <span
                      key={`${passageLayoutKey}-w-${seg.start}`}
                      className="glyph-word"
                    >
                      {Array.from(
                        { length: seg.end - seg.start },
                        (_, j) => seg.start + j,
                      ).map((i) => {
                        const targetCh = passage[i]
                        const statusClass = glyphStatusClass(i, targetCh)
                        return (
                          <span
                            key={`${passageLayoutKey}-${i}`}
                            className={`glyph ${statusClass}`}
                          >
                            {targetCh}
                          </span>
                        )
                      })}
                    </span>
                  )
                })}
              </div>
            </div>

            {!finished && (
              <div className="desk-zone">
                <label className="desk-zone__label" htmlFor="typing-input">
                  Entry field
                </label>
                <textarea
                  id="typing-input"
                  ref={inputRef}
                  className="typing-input"
                  value={typed}
                  onChange={handleChange}
                  onPaste={(e) => e.preventDefault()}
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  rows={difficulty === 'hard' ? 8 : 3}
                  readOnly={finished}
                />

                <div className="actions">
                  <button
                    type="button"
                    className="btn-reset"
                    onClick={handleReset}
                  >
                    Start over
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <ResultsModal
        open={finished}
        passed={passed}
        finalWpm={finalWpm}
        accuracyPct={finalAccuracyPct}
        successCount={successCount}
        failureCount={failureCount}
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        onStartOver={handleReset}
      />
    </div>
  )
}
