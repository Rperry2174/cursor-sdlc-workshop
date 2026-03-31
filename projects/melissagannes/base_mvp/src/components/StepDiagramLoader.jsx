import { useEffect, useState } from 'react'
import { StepDiagram } from './StepDiagram'

/**
 * Loads optional per-step SVG from `public/steps/<lessonId>/<stepIndex>.svg`
 * (Figma / Illustrator exports). Falls back to inline {@link StepDiagram} if missing.
 *
 * Parent should pass `key={\`${lessonId}-${stepIndex}\`}` so each step remounts
 * and fetch state resets without synchronous setState in an effect.
 */
export function StepDiagramLoader({ lessonId, stepIndex }) {
  /** `undefined` = fetch not finished; string = use asset; `null` = use inline fallback */
  const [remote, setRemote] = useState(undefined)

  useEffect(() => {
    const url = `/steps/${lessonId}/${stepIndex}.svg`
    let cancelled = false
    fetch(url)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error('missing'))))
      .then((text) => {
        if (cancelled) return
        const t = text.trim()
        setRemote(t.length > 0 ? t : null)
      })
      .catch(() => {
        if (!cancelled) setRemote(null)
      })
    return () => {
      cancelled = true
    }
  }, [lessonId, stepIndex])

  if (remote === undefined) {
    return <StepDiagram lessonId={lessonId} stepIndex={stepIndex} />
  }

  if (remote) {
    return (
      <div
        className="step-diagram__inject"
        dangerouslySetInnerHTML={{ __html: remote }}
      />
    )
  }

  return <StepDiagram lessonId={lessonId} stepIndex={stepIndex} />
}
