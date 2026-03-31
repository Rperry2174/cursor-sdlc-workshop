import { CATEGORIES } from '../data/lessons'

export function CategoryPicker({ activeCategoryId, onSelect }) {
  return (
    <div className="category-picker" role="tablist" aria-label="Drawing category">
      {CATEGORIES.map((cat) => {
        const selected = cat.id === activeCategoryId
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={selected}
            className={`category-picker__chip${selected ? ' category-picker__chip--active' : ''}`}
            onClick={() => onSelect(cat.id)}
          >
            <span className="category-picker__emoji" aria-hidden>
              {cat.emoji}
            </span>
            <span>{cat.label}</span>
          </button>
        )
      })}
    </div>
  )
}
