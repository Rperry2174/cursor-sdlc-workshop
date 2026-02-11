import { useState } from 'react'
import { currentWeather } from './data/weatherStub.js'
import UnitToggle from './UnitToggle.jsx'
import './App.css'

const toF = (c) => c * 9 / 5 + 32

/**
 * Main view: shows current location, temperature (one unit), and condition as text.
 * Teammates add: location selector, condition icon, extra stats card.
 */
function App() {
  const [unit, setUnit] = useState('C')
  const displayTemp = unit === 'F' ? toF(currentWeather.temperature) : currentWeather.temperature
  const displayUnit = unit === 'F' ? '°F' : '°C'

  return (
    <main className="weather-card">
      <h1 className="weather-card__location">{currentWeather.location}</h1>
      <p className="weather-card__temp">{Math.round(displayTemp)}{displayUnit}</p>
      <UnitToggle unit={unit} onUnitChange={setUnit} />
      <p className="weather-card__condition">{currentWeather.condition}</p>
    </main>
  )
}

export default App
