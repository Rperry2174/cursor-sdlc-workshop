/**
 * Open-Meteo APIs — no API key required.
 * @see https://open-meteo.com/
 */

export interface GeocodeResult {
  name: string
  admin1?: string
  country: string
  latitude: number
  longitude: number
}

export interface CurrentWeather {
  locationLabel: string
  timezone: string
  /** Seconds east of UTC (e.g. -14400 for EDT). */
  utcOffsetSeconds: number
  time: string
  temperatureC: number
  apparentTemperatureC: number
  relativeHumidity: number
  precipitationMm: number
  weatherCode: number
  windMph: number
}

interface GeocodeResponse {
  results?: Array<{
    name: string
    admin1?: string
    country: string
    latitude: number
    longitude: number
  }>
}

interface ForecastResponse {
  timezone: string
  utc_offset_seconds: number
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    precipitation: number
    weather_code: number
    wind_speed_10m: number
  }
}

export async function searchLocation(query: string): Promise<GeocodeResult | null> {
  const trimmed = query.trim()
  if (!trimmed) return null

  const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
  url.searchParams.set('name', trimmed)
  url.searchParams.set('count', '5')
  url.searchParams.set('language', 'en')
  url.searchParams.set('format', 'json')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Could not search for that place.')
  const data: GeocodeResponse = await res.json()
  const first = data.results?.[0]
  if (!first) return null

  return {
    name: first.name,
    admin1: first.admin1,
    country: first.country,
    latitude: first.latitude,
    longitude: first.longitude,
  }
}

export async function fetchWeatherForCoords(
  lat: number,
  lon: number,
  locationLabel: string,
): Promise<CurrentWeather> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(lat))
  url.searchParams.set('longitude', String(lon))
  url.searchParams.set(
    'current',
    [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
    ].join(','),
  )
  url.searchParams.set('wind_speed_unit', 'mph')
  url.searchParams.set('timezone', 'auto')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Weather data is unavailable right now.')
  const data: ForecastResponse = await res.json()

  const c = data.current
  return {
    locationLabel,
    timezone: data.timezone,
    utcOffsetSeconds: data.utc_offset_seconds,
    time: c.time,
    temperatureC: c.temperature_2m,
    apparentTemperatureC: c.apparent_temperature,
    relativeHumidity: c.relative_humidity_2m,
    precipitationMm: c.precipitation,
    weatherCode: c.weather_code,
    windMph: c.wind_speed_10m,
  }
}
