/**
 * Renders a simple icon for the given weather condition.
 * Uses inline SVG — no external API or icon service.
 */
function ConditionIcon({ condition }) {
  const normalized = condition ? String(condition).trim() : ''
  const key = normalized.toLowerCase()

  const icons = {
    sunny: (
      <svg className="condition-icon condition-icon--sunny" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="5" fill="currentColor" />
        <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="1.5" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="1.5" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="1.5" />
        <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="1.5" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    cloudy: (
      <svg className="condition-icon condition-icon--cloudy" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
        />
      </svg>
    ),
    rainy: (
      <svg className="condition-icon condition-icon--rainy" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M6 14c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1s1-.45 1-1v-3c0-.55-.45-1-1-1zm4 0c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1s1-.45 1-1v-3c0-.55-.45-1-1-1zm4 0c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1s1-.45 1-1v-3c0-.55-.45-1-1-1z"
        />
        <path
          fill="currentColor"
          d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
        />
      </svg>
    ),
    'partly cloudy': (
      <svg className="condition-icon condition-icon--partly-cloudy" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" fill="currentColor" />
        <path
          fill="currentColor"
          opacity="0.7"
          d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
        />
      </svg>
    ),
    snowy: (
      <svg className="condition-icon condition-icon--snowy" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
        />
        <path fill="currentColor" d="M12 16v2m0 2v2m0-4v2m0-4v-2m-2 2h4m-4 0h4m-2-2v4m0-4v4" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    ),
    stormy: (
      <svg className="condition-icon condition-icon--stormy" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
        />
        <path fill="currentColor" d="M13 17h2l-1.5-3 1.5-3h-2l-1.5 3 1.5 3zm-5 0h2l-1.5-3 1.5-3H8L6.5 14 8 17z" />
      </svg>
    ),
    foggy: (
      <svg className="condition-icon condition-icon--foggy" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          opacity="0.6"
          d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
        />
        <line x1="4" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="2" opacity="0.8" />
        <line x1="6" y1="19" x2="18" y2="19" stroke="currentColor" strokeWidth="2" opacity="0.8" />
      </svg>
    ),
  }

  const bySubstring = () => {
    if (/rain|drizzle|shower/i.test(normalized)) return icons.rainy
    if (/storm|thunder|lightning/i.test(normalized)) return icons.stormy
    if (/snow|flurr/i.test(normalized)) return icons.snowy
    if (/fog|mist|haze/i.test(normalized)) return icons.foggy
    if (/partly|partially/i.test(normalized) && /cloud/i.test(normalized)) return icons['partly cloudy']
    if (/cloud|overcast/i.test(normalized)) return icons.cloudy
    return icons.sunny
  }

  const icon =
    icons[key] ||
    icons[key.replace(/\s+/g, ' ')] ||
    bySubstring()

  return <span className="condition-icon-wrap">{icon}</span>
}

export default ConditionIcon
