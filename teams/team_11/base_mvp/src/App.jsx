import { currentWeather } from './data/weatherStub.js'
import './App.css'

/**
 * Main view: shows current location, temperature (one unit), and condition as text.
 * Teammates add: unit toggle, location selector, condition icon, extra stats card.
 */
function App() {
  return (
    <main className="weather-card">
      <h1 className="weather-card__location">{currentWeather.location}</h1>
      <p className="weather-card__temp">{currentWeather.temperature}°C</p>
      <p className="weather-card__condition">{currentWeather.condition}</p>
    </main>
  )
}

export default App
