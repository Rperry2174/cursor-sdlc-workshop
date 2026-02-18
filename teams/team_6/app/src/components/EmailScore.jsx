import { useState, useEffect } from 'react'

function getApiBase() {
  if (typeof window === 'undefined') return ''
  return window.location.origin
}

export default function EmailScore() {
  const [emailStats, setEmailStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchStats() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${getApiBase()}/api/gmail/stats`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setEmailStats(data)
      } else {
        const data = await res.json().catch(() => ({}))
        setEmailStats(null)
        if (res.status === 401) setError(null)
        else setError(data.error || 'Could not load email stats')
      }
    } catch (e) {
      setEmailStats(null)
      setError('Network error — make sure you’re deployed on Vercel with API routes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('gmail_connected') === '1' || params.get('gmail_error')) {
      window.history.replaceState({}, '', window.location.pathname)
      fetchStats()
    }
  }, [])

  function handleConnectGoogle() {
    window.location.href = `${getApiBase()}/api/auth/google`
  }

  if (loading && !emailStats) {
    return (
      <section className="email-score card">
        <h2>Email score</h2>
        <p className="email-score-muted">Checking connection…</p>
      </section>
    )
  }

  if (!emailStats) {
    return (
      <section className="email-score card">
        <h2>Email score</h2>
        <p className="email-score-muted">
          Connect Gmail to score your day from sent & received email (amount + activity).
        </p>
        {error && <p className="email-score-error">{error}</p>}
        <button type="button" className="email-connect-btn" onClick={handleConnectGoogle}>
          Connect Google (Gmail)
        </button>
      </section>
    )
  }

  return (
    <section className="email-score card">
      <h2>Email score</h2>
      <div className="email-score-stats">
        <div className="email-score-number">{emailStats.score}</div>
        <div className="email-score-letter">{emailStats.letterGrade}</div>
      </div>
      <p className="email-score-breakdown">{emailStats.breakdown}</p>
      <div className="email-score-meta">
        <span>Sent: {emailStats.sentCount}</span>
        <span>Received: {emailStats.receivedCount}</span>
      </div>
      <button type="button" className="email-refresh-btn" onClick={fetchStats} disabled={loading}>
        {loading ? 'Refreshing…' : 'Refresh email score'}
      </button>
    </section>
  )
}
