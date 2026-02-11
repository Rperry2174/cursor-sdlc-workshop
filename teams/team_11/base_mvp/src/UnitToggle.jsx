import './UnitToggle.css'

/**
 * Controlled toggle to switch between °C and °F.
 * @param { 'C' | 'F' } unit - Current unit
 * @param { (unit: 'C' | 'F') => void } onUnitChange - Called when user selects a unit
 */
function UnitToggle({ unit, onUnitChange }) {
  return (
    <div className="unit-toggle" role="group" aria-label="Temperature unit">
      <button
        type="button"
        className={`unit-toggle__btn ${unit === 'C' ? 'unit-toggle__btn--active' : ''}`}
        onClick={() => onUnitChange('C')}
        aria-pressed={unit === 'C'}
      >
        °C
      </button>
      <button
        type="button"
        className={`unit-toggle__btn ${unit === 'F' ? 'unit-toggle__btn--active' : ''}`}
        onClick={() => onUnitChange('F')}
        aria-pressed={unit === 'F'}
      >
        °F
      </button>
    </div>
  )
}

export default UnitToggle
