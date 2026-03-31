import { useMemo, useState } from 'react'

function HintImg({ src, onFail }) {
  const [show, setShow] = useState(false)

  return (
    <img
      className="figma-panel__hint-img"
      src={src}
      alt=""
      decoding="async"
      loading="lazy"
      style={{ display: show ? 'block' : 'none' }}
      onLoad={() => setShow(true)}
      onError={onFail}
    />
  )
}

/**
 * Optional reference image for the current step.
 * Uses `step.hintImage` if set, else tries `/images/hints/<lessonId>/<stepIndex>.{svg,png,jpg,jpeg}`.
 * Renders nothing if no file loads.
 */
export function StepHintImage({ lessonId, stepIndex, step }) {
  const candidates = useMemo(() => {
    if (step?.hintImage) return [step.hintImage]
    const base = `/images/hints/${lessonId}/${stepIndex}`
    return [`${base}.svg`, `${base}.png`, `${base}.jpg`, `${base}.jpeg`]
  }, [lessonId, stepIndex, step])

  const [index, setIndex] = useState(0)

  if (index >= candidates.length) {
    return null
  }

  const src = candidates[index]

  return (
    <figure className="figma-panel__hint">
      <figcaption className="figma-panel__hint-label">Step hint</figcaption>
      <HintImg
        key={src}
        src={src}
        onFail={() => setIndex((i) => i + 1)}
      />
    </figure>
  )
}
