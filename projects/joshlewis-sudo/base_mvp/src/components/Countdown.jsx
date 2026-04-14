import { useState, useEffect } from 'react'
import './Countdown.css'

function Countdown({ targetTime }) {
  const [remaining, setRemaining] = useState(() => calcRemaining(targetTime))

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(calcRemaining(targetTime))
    }, 1000)
    return () => clearInterval(id)
  }, [targetTime])

  if (remaining <= 0) {
    return <span className="countdown countdown--live">LIVE / FINAL</span>
  }

  const days = Math.floor(remaining / 86400)
  const hours = Math.floor((remaining % 86400) / 3600)
  const minutes = Math.floor((remaining % 3600) / 60)
  const seconds = remaining % 60

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  parts.push(`${hours}h`)
  parts.push(`${String(minutes).padStart(2, '0')}m`)
  parts.push(`${String(seconds).padStart(2, '0')}s`)

  return <span className="countdown">{parts.join(' ')}</span>
}

function calcRemaining(targetTime) {
  return Math.max(0, Math.floor((new Date(targetTime) - Date.now()) / 1000))
}

export default Countdown
