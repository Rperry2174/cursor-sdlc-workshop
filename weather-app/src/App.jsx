import { useState } from 'react'
import { weatherData, cityIds } from './data/weatherData'

const weatherIcons = {
  sunny: '☀️',
  'partly-cloudy': '⛅',
  cloudy: '☁️',
  rainy: '🌧️',
  snowy: '❄️',
}

function formatTemp(tempF, unit) {
  if (unit === '°F') return `${Math.round(tempF)}°F`
  const tempC = ((tempF - 32) * 5) / 9
  return `${Math.round(tempC)}°C`
}

function formatDateTime() {
  return new Date().toLocaleString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function App() {
  const [selectedCity, setSelectedCity] = useState('san-francisco')
  const [unit, setUnit] = useState('°F')

  const data = weatherData[selectedCity]
  const icon = weatherIcons[data.current.icon] || '🌤️'

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-sky-400 text-slate-800">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header: City selector + Unit toggle */}
        <header className="flex justify-between items-center mb-8">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/90 border border-slate-200 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Select city"
          >
            {cityIds.map((id) => (
              <option key={id} value={id}>
                {weatherData[id].location.city}
              </option>
            ))}
          </select>
          <button
            onClick={() => setUnit((u) => (u === '°F' ? '°C' : '°F'))}
            className="px-4 py-2 rounded-lg bg-white/90 border border-slate-200 text-slate-800 font-medium hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label={`Switch to ${unit === '°F' ? 'Celsius' : 'Fahrenheit'}`}
          >
            {unit}
          </button>
        </header>

        {/* Current weather */}
        <main className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
          <p className="text-slate-600 text-sm mb-1">
            {data.location.city}, {data.location.region}
          </p>
          <p className="text-slate-500 text-sm mb-6">{formatDateTime()}</p>

          <div className="flex items-center gap-6 mb-8">
            <span className="text-7xl" role="img" aria-label={data.current.condition}>
              {icon}
            </span>
            <div>
              <p className="text-6xl font-bold tabular-nums text-slate-800">
                {formatTemp(data.current.temp, unit)}
              </p>
              <p className="text-xl text-slate-600">{data.current.condition}</p>
              <p className="text-sm text-slate-500">
                Feels like {formatTemp(data.current.feelsLike, unit)}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-500">Humidity</span>
              <span className="font-medium">{data.current.humidity}%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-500">Wind</span>
              <span className="font-medium">
                {data.current.windSpeed} mph {data.current.windDirection}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-500">UV Index</span>
              <span className="font-medium">{data.current.uvIndex}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-500">Sunrise / Sunset</span>
              <span className="font-medium text-right">
                {data.current.sunrise}
                <br />
                {data.current.sunset}
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
