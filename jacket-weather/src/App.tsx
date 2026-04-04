import { useCallback, useState } from 'react'
import {
  fetchWeatherForCoords,
  searchLocation,
  type CurrentWeather,
} from './lib/weather'
import { recommendJacket } from './lib/jacketRecommendation'
import './App.css'

/** Open-Meteo `current.time` is local wall time; combine with offset for a real instant. */
function formatTime(isoLike: string, timezone: string, utcOffsetSeconds: number): string {
  try {
    const m = isoLike.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
    if (!m) return isoLike
    const y = Number(m[1])
    const mo = Number(m[2])
    const d = Number(m[3])
    const h = Number(m[4])
    const mi = Number(m[5])
    const utcMs = Date.UTC(y, mo - 1, d, h, mi) - utcOffsetSeconds * 1000
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone,
    }).format(new Date(utcMs))
  } catch {
    return isoLike
  }
}

function App() {
  const [query, setQuery] = useState('')
  const [weather, setWeather] = useState<CurrentWeather | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const loadWeather = useCallback(async (label: string, lat: number, lon: number) => {
    setLoading(true)
    setError(null)
    try {
      const w = await fetchWeatherForCoords(lat, lon, label)
      setWeather(w)
    } catch (e) {
      setWeather(null)
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }, [])

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return

    setLoading(true)
    setError(null)
    try {
      const place = await searchLocation(q)
      if (!place) {
        setWeather(null)
        setError('No place matched that search. Try another city name.')
        return
      }
      const label = [place.name, place.admin1, place.country]
        .filter(Boolean)
        .join(', ')
      await loadWeather(label, place.latitude, place.longitude)
    } catch (e) {
      setWeather(null)
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const onUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Your browser does not support location.')
      return
    }
    setLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        const label = 'Your location'
        await loadWeather(label, latitude, longitude)
      },
      () => {
        setLoading(false)
        setError(
          'Location permission was denied or unavailable. Try searching for a city instead.',
        )
      },
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 300_000 },
    )
  }

  const rec = weather ? recommendJacket(weather) : null

  return (
    <div className="app">
      <header className="header">
        <p className="eyebrow">Today’s weather</p>
        <h1 className="title">What jacket should I wear?</h1>
        <p className="lede">
          We use live conditions (temperature, wind, rain or snow) to suggest a practical outer layer.
        </p>
      </header>

      <form className="search" onSubmit={onSearch} aria-label="Search for a city">
        <label className="sr-only" htmlFor="city">
          City or place
        </label>
        <input
          id="city"
          type="search"
          className="input"
          placeholder="Search city (e.g. Seattle)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? 'Loading…' : 'Get forecast'}
        </button>
        <button
          type="button"
          className="btn secondary"
          onClick={onUseLocation}
          disabled={loading}
        >
          Use my location
        </button>
      </form>

      {error ? (
        <p className="message error" role="alert">
          {error}
        </p>
      ) : null}

      {weather && rec ? (
        <article className="card" aria-live="polite">
          <div className="card-head">
            <div>
              <h2 className="location">{weather.locationLabel}</h2>
              <p className="meta">
                {formatTime(weather.time, weather.timezone, weather.utcOffsetSeconds)} · Feels like{' '}
                {Math.round(weather.apparentTemperatureC)}°C /{' '}
                {Math.round((weather.apparentTemperatureC * 9) / 5 + 32)}°F
              </p>
            </div>
            <div className="temps" aria-hidden="true">
              <span className="big-temp">{Math.round(weather.temperatureC)}°</span>
              <span className="humidity">{weather.relativeHumidity}% humidity</span>
            </div>
          </div>

          <div className="recommendation">
            <p className="rec-label">Ideal jacket</p>
            <p className="rec-title">{rec.title}</p>
            <p className="rec-summary">{rec.summary}</p>
            {rec.tips.length > 0 ? (
              <ul className="tips">
                {rec.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </article>
      ) : null}

      <footer className="footer">
        <p>
          Forecast data from{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
            Open-Meteo
          </a>{' '}
          (no API key). Recommendations are general guidance, not professional advice.
        </p>
      </footer>
    </div>
  )
}

export default App
