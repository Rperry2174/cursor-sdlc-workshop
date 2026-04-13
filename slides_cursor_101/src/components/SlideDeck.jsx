import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { deckSlides } from '../slide-system/slides.js'
import { STAGE } from '../slide-system/layout.js'
import { RenderSlide } from '../slide-system/renderers/react.jsx'

function getInitialSlide(totalSlides) {
  if (typeof window === 'undefined') return 1

  const value = Number.parseInt(new URLSearchParams(window.location.search).get('slide') ?? '', 10)
  if (!Number.isFinite(value)) return 1
  return Math.min(Math.max(value, 1), totalSlides)
}

const SlideDeck = () => {
  const totalSlides = deckSlides.length
  const [currentSlide, setCurrentSlide] = useState(() => getInitialSlide(totalSlides))
  const [stageScale, setStageScale] = useState(1)
  const viewportRef = useRef(null)

  const showSlide = useCallback(
    (slideNumber) => {
      let nextSlide = slideNumber
      if (nextSlide > totalSlides) nextSlide = 1
      if (nextSlide < 1) nextSlide = totalSlides
      setCurrentSlide(nextSlide)
    },
    [totalSlides],
  )

  const changeSlide = useCallback(
    (delta) => {
      showSlide(currentSlide + delta)
    },
    [currentSlide, showSlide],
  )

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault()
        changeSlide(1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        changeSlide(-1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [changeSlide])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return undefined

    const updateScale = () => {
      const fitScale = Math.min(
        viewport.clientWidth / STAGE.widthPx,
        viewport.clientHeight / STAGE.heightPx,
      )
      const nextScale = fitScale * 0.9

      setStageScale(Number.isFinite(nextScale) ? nextScale : 1)
    }

    updateScale()

    const resizeObserver = new ResizeObserver(updateScale)
    resizeObserver.observe(viewport)

    window.addEventListener('resize', updateScale)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateScale)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.set('slide', String(currentSlide))
    const search = params.toString()
    const nextUrl = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`
    window.history.replaceState(null, '', nextUrl)
  }, [currentSlide])

  const progress = (currentSlide / totalSlides) * 100
  const activeSlide = useMemo(() => deckSlides[currentSlide - 1], [currentSlide])
  const className = useMemo(
    () => ['slide', activeSlide?.className, 'active'].filter(Boolean).join(' '),
    [activeSlide],
  )

  return (
    <>
      <div className="progress-bar" style={{ width: `${progress}%` }} />

      <div className="slide-container">
        <div className="slide-stage-viewport" ref={viewportRef}>
          <div className="slide-stage-scale" style={{ transform: `scale(${stageScale})` }}>
            <div
              className={className}
              data-slide={activeSlide.id}
              key={activeSlide.id}
              style={{ width: `${STAGE.widthPx}px`, height: `${STAGE.heightPx}px` }}
            >
              <RenderSlide slide={activeSlide} />
            </div>
          </div>
        </div>
      </div>

      <div className="nav">
        <button
          className="nav-btn"
          onClick={() => changeSlide(-1)}
          disabled={currentSlide === 1}
        >
          ←
        </button>
        <span className="slide-counter">
          <span>{currentSlide}</span> / <span>{totalSlides}</span>
        </span>
        <button
          className="nav-btn"
          onClick={() => changeSlide(1)}
          disabled={currentSlide === totalSlides}
        >
          →
        </button>
      </div>
    </>
  )
}

export default SlideDeck
