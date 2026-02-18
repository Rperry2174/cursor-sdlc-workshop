export default function SummaryList({ items, onRemove }) {
  if (!items || items.length === 0) return null

  return (
    <section className="summary-list" aria-label="Today's accomplishments">
      <h3>Today&apos;s list</h3>
      <ul>
        {items.map((text, i) => (
          <li key={`${i}-${text.slice(0, 20)}`}>
            <span>{text}</span>
            {onRemove && (
              <button type="button" onClick={() => onRemove(i)} aria-label={`Remove: ${text}`}>
                ×
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
