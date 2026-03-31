import { useMemo, useState } from 'react'
import { CATEGORIES, searchLessons } from '../data/lessons'

function categoryEmoji(categoryId) {
  return CATEGORIES.find((c) => c.id === categoryId)?.emoji ?? '🎨'
}

export function LessonSearch({ activeLessonId, onPickLesson, compact = false }) {
  const [query, setQuery] = useState('')

  const matches = useMemo(() => searchLessons(query), [query])

  return (
    <section
      className={'lesson-search' + (compact ? ' lesson-search--compact' : '')}
      aria-labelledby="lesson-search-heading"
    >
      <h2
        id="lesson-search-heading"
        className={
          compact ? 'lesson-search__sr-only' : 'lesson-search__title'
        }
      >
        Find something to draw
      </h2>
      {!compact && (
        <p className="lesson-search__hint">
          Type a word or tap a picture below.
        </p>
      )}

      <label className="lesson-search__label" htmlFor="draw-search">
        Search drawings
      </label>
      <input
        id="draw-search"
        className="lesson-search__input"
        type="search"
        name="draw-search"
        autoComplete="off"
        spellCheck="false"
        placeholder="Try: cat, car, house…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        enterKeyHint="search"
      />

      <ul className="lesson-search__results" aria-label="Drawing ideas">
        {matches.length === 0 ? (
          <li className="lesson-search__empty" role="status">
            No match. Try <strong>cat</strong>, <strong>car</strong>, or{' '}
            <strong>house</strong>.
          </li>
        ) : (
          matches.map((lesson) => {
            const selected = lesson.id === activeLessonId
            return (
              <li key={lesson.id} className="lesson-search__item">
                <button
                  type="button"
                  aria-current={selected || undefined}
                  className={
                    'lesson-search__pick' +
                    (selected ? ' lesson-search__pick--active' : '')
                  }
                  onClick={() => onPickLesson(lesson.id)}
                >
                  <span className="lesson-search__pick-emoji" aria-hidden>
                    {categoryEmoji(lesson.categoryId)}
                  </span>
                  <span className="lesson-search__pick-text">{lesson.title}</span>
                </button>
              </li>
            )
          })
        )}
      </ul>
    </section>
  )
}
