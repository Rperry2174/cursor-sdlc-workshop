import { useMemo, useState } from 'react'
import {
  DEFAULT_LESSON_BY_CATEGORY,
  getLesson,
} from '../data/lessons'
import { CategoryPicker } from './CategoryPicker'
import { LessonSearch } from './LessonSearch'
import { StepDiagramLoader } from './StepDiagramLoader'
import { StepHintImage } from './StepHintImage'

export function LessonView() {
  const [categoryId, setCategoryId] = useState('animals')
  const [lessonId, setLessonId] = useState(
    () => DEFAULT_LESSON_BY_CATEGORY.animals,
  )
  const [stepIndex, setStepIndex] = useState(0)

  const lesson = useMemo(() => getLesson(lessonId), [lessonId])
  const totalSteps = lesson.steps.length
  const isLast = stepIndex >= totalSteps - 1

  function handleCategory(nextCategoryId) {
    setCategoryId(nextCategoryId)
    const nextLesson = DEFAULT_LESSON_BY_CATEGORY[nextCategoryId]
    setLessonId(nextLesson)
    setStepIndex(0)
  }

  function handlePickLesson(nextLessonId) {
    const next = getLesson(nextLessonId)
    if (!next) return
    setLessonId(nextLessonId)
    setCategoryId(next.categoryId)
    setStepIndex(0)
  }

  function goNext() {
    if (stepIndex < totalSteps - 1) setStepIndex((i) => i + 1)
  }

  function goBack() {
    if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  function restart() {
    setStepIndex(0)
  }

  const step = lesson.steps[stepIndex]
  const showCelebration = isLast

  return (
    <div className="figma-app">
      <aside className="figma-sidebar" aria-label="Project and assets">
        <div className="figma-brand">
          <span className="figma-brand__mark" aria-hidden />
          <span className="figma-brand__text">StepDraw Jr</span>
        </div>

        <p className="figma-sidebar__label">Find</p>
        <LessonSearch
          compact
          activeLessonId={lessonId}
          onPickLesson={handlePickLesson}
        />

        <p className="figma-sidebar__label">Categories</p>
        <CategoryPicker
          activeCategoryId={categoryId}
          onSelect={handleCategory}
        />
      </aside>

      <section className="figma-canvas-column" aria-label="Canvas">
        <header className="figma-canvas-toolbar">
          <span className="figma-canvas-toolbar__title">{lesson.title}</span>
          <span className="figma-canvas-toolbar__meta">
            Step {stepIndex + 1} / {totalSteps}
          </span>
        </header>

        <div className="figma-canvas">
          <div className="figma-frame">
            <div className="figma-frame__inner">
              <StepDiagramLoader
                key={`${lessonId}-${stepIndex}`}
                lessonId={lessonId}
                stepIndex={stepIndex}
              />
            </div>
          </div>
        </div>
      </section>

      <aside className="figma-panel" aria-label="Instructions">
        <p className="figma-panel__section">Instructions</p>
        <StepHintImage
          key={`hint-${lessonId}-${stepIndex}`}
          lessonId={lessonId}
          stepIndex={stepIndex}
          step={step}
        />
        <div
          className="figma-step-dots"
          role="group"
          aria-label="Steps; click a dot to jump"
        >
          {lesson.steps.map((_, i) => (
            <button
              key={i}
              type="button"
              className={
                'figma-step-dots__dot' +
                (i === stepIndex ? ' figma-step-dots__dot--active' : '') +
                (i < stepIndex ? ' figma-step-dots__dot--done' : '')
              }
              aria-label={`Step ${i + 1}${i === stepIndex ? ' (current)' : ''}`}
              aria-current={i === stepIndex ? 'true' : undefined}
              onClick={() => setStepIndex(i)}
            />
          ))}
        </div>

        <p className="figma-panel__step-num">
          Step {stepIndex + 1} of {totalSteps}
        </p>
        <p className="figma-panel__instruction">{step.text}</p>

        {showCelebration && (
          <p className="figma-panel__celebration" role="status">
            You did it! Great drawing!
          </p>
        )}

        <div className="figma-panel__nav">
          <button
            type="button"
            className="figma-btn figma-btn--ghost"
            onClick={goBack}
            disabled={stepIndex === 0}
          >
            Back
          </button>
          {isLast ? (
            <button
              type="button"
              className="figma-btn figma-btn--primary"
              onClick={restart}
            >
              Draw again
            </button>
          ) : (
            <button
              type="button"
              className="figma-btn figma-btn--primary"
              onClick={goNext}
            >
              Next
            </button>
          )}
        </div>
      </aside>
    </div>
  )
}
