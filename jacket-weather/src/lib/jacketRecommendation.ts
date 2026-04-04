import type { CurrentWeather } from './weather'

export interface JacketRecommendation {
  /** Short title for the main suggestion */
  title: string
  /** One-line summary */
  summary: string
  /** Extra considerations (rain, wind, etc.) */
  tips: string[]
}

function cToF(c: number): number {
  return (c * 9) / 5 + 32
}

/** WMO weather interpretation codes (Open-Meteo). */
function isSnowCode(code: number): boolean {
  return (code >= 71 && code <= 77) || code === 85 || code === 86
}

function isRainOrStormCode(code: number): boolean {
  return (
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82) ||
    (code >= 95 && code <= 99)
  )
}

function isDrizzleCode(code: number): boolean {
  return code >= 51 && code <= 57
}

function weatherLabel(code: number): string {
  const map: Record<number, string> = {
    0: 'Clear',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Fog',
    51: 'Light drizzle',
    53: 'Drizzle',
    55: 'Dense drizzle',
    56: 'Freezing drizzle',
    57: 'Freezing drizzle',
    61: 'Light rain',
    63: 'Rain',
    65: 'Heavy rain',
    66: 'Freezing rain',
    67: 'Freezing rain',
    71: 'Light snow',
    73: 'Snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Rain showers',
    81: 'Rain showers',
    82: 'Violent rain showers',
    85: 'Snow showers',
    86: 'Snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with hail',
  }
  return map[code] ?? 'Mixed conditions'
}

/**
 * Pick an ideal jacket using feels-like temperature, precipitation type,
 * and wind. Uses Celsius internally; tips can mention °F for intuition.
 */
export function recommendJacket(weather: CurrentWeather): JacketRecommendation {
  const feels = weather.apparentTemperatureC
  const feelsF = Math.round(cToF(feels))
  const code = weather.weatherCode
  const precip = weather.precipitationMm
  const windy = weather.windMph >= 22
  const veryWindy = weather.windMph >= 35

  const snow = isSnowCode(code)
  const wet = isRainOrStormCode(code) || precip >= 0.3 || (isDrizzleCode(code) && precip > 0)
  const conditions = weatherLabel(code)

  const tips: string[] = []
  if (veryWindy) {
    tips.push(
      `Wind is strong (~${Math.round(weather.windMph)} mph) — a windbreaker shell helps cut the chill.`,
    )
  } else if (windy) {
    tips.push(
      `Breezy (~${Math.round(weather.windMph)} mph); a close-fitting layer or wind-resistant outer helps.`,
    )
  }

  // Snow: prioritize warmth + water resistance
  if (snow) {
    const title = 'Insulated winter coat or parka'
    const summary = `${conditions} and cold (feels like ${feelsF}°F). A warm, water-resistant parka or down jacket with a hood is ideal.`
    tips.unshift('Snow on the forecast — waterproof boots and gloves matter too.')
    return { title, summary, tips }
  }

  // Rain / storms: waterproof first
  if (wet && feels < 18) {
    const title = 'Waterproof rain jacket or shell'
    const summary = `${conditions} (feels like ${feelsF}°F). Wear a breathable waterproof shell; add a warm mid-layer underneath if you run cold.`
    if (code >= 95) tips.unshift('Thunderstorms possible — seek shelter if lightning is nearby.')
    return { title, summary, tips }
  }

  if (wet && feels >= 18) {
    const title = 'Light waterproof jacket or packable rain shell'
    const summary = `${conditions} and mild (feels like ${feelsF}°F). A light rain jacket or water-resistant windbreaker is enough; you may not need insulation.`
    return { title, summary, tips }
  }

  // Dry — temperature bands (feels-like °C)
  if (feels <= -12) {
    return {
      title: 'Heavy down parka or expedition-style coat',
      summary: `Feels like ${feelsF}°F (${conditions.toLowerCase()}). Choose maximum insulation: long parka, down fill, and layers you can adjust.`,
      tips,
    }
  }
  if (feels <= -1) {
    return {
      title: 'Insulated puffer or winter jacket',
      summary: `Feels like ${feelsF}°F. A well-insulated winter jacket or thick puffer with a hat and scarf is appropriate.`,
      tips,
    }
  }
  if (feels <= 7) {
    return {
      title: 'Medium-weight jacket or wool coat',
      summary: `Feels like ${feelsF}°F (${conditions.toLowerCase()}). Try a wool peacoat, lined jacket, or fleece under a light shell.`,
      tips,
    }
  }
  if (feels <= 12) {
    return {
      title: 'Light jacket, fleece, or denim jacket',
      summary: `Feels like ${feelsF}°F. A light jacket, hoodie under a shell, or fleece works well.`,
      tips,
    }
  }
  if (feels <= 17) {
    return {
      title: 'Hoodie, cardigan, or very light jacket',
      summary: `Feels like ${feelsF}°F — cool but not cold. A single comfortable layer is usually enough.`,
      tips,
    }
  }
  if (feels <= 22) {
    return {
      title: 'Optional light layer',
      summary: `Feels like ${feelsF}°F (${conditions.toLowerCase()}). You may only need a long-sleeve shirt; bring a light layer if you chill easily.`,
      tips,
    }
  }
  return {
    title: 'No jacket needed',
    summary: `Feels like ${feelsF}°F — warm enough that a jacket is usually unnecessary. Sun protection may matter more than layers.`,
    tips,
  }
}
