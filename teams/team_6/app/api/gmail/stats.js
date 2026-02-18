/**
 * Returns today's Gmail stats (sent count, received count) and an email-based score.
 * Reads gmail_refresh cookie and uses Gmail API with a temporary access token.
 */
export default async function handler(req, res) {
  const cookieHeader = req.headers.cookie || ''
  const match = cookieHeader.match(/gmail_refresh=([^;]+)/)
  const refreshToken = match ? decodeURIComponent(match[1]) : null

  if (!refreshToken) {
    res.status(401).json({ error: 'not_connected' })
    return
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    res.status(500).json({ error: 'server_config' })
    return
  }

  // Get access token from refresh token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }).toString(),
  })

  if (!tokenRes.ok) {
    res.status(401).json({ error: 'token_refresh_failed' })
    return
  }

  const { access_token } = await tokenRes.json()
  if (!access_token) {
    res.status(401).json({ error: 'no_access_token' })
    return
  }

  const today = new Date()
  const after = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`
  const auth = `Bearer ${access_token}`

  // Gmail API: list message IDs for SENT and INBOX for today
  const [sentRes, inboxRes] = await Promise.all([
    fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=500&labelIds=SENT&q=after:${after}`,
      { headers: { Authorization: auth } }
    ),
    fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=500&labelIds=INBOX&q=after:${after}`,
      { headers: { Authorization: auth } }
    ),
  ])

  if (!sentRes.ok || !inboxRes.ok) {
    res.status(502).json({ error: 'gmail_api_failed' })
    return
  }

  const sentData = await sentRes.json()
  const inboxData = await inboxRes.json()
  const sentCount = sentData.messages?.length ?? 0
  const receivedCount = inboxData.messages?.length ?? 0
  const total = sentCount + receivedCount

  // Score: reward sent (outbound productivity) and some received; cap at 100
  // Simple formula: sent*4 + received*1, max 100. Letter grade same as manual score.
  const rawScore = Math.min(100, sentCount * 4 + receivedCount)
  const letterGrade = rawScore >= 90 ? 'A' : rawScore >= 80 ? 'B' : rawScore >= 70 ? 'C' : rawScore >= 60 ? 'D' : 'F'

  res.setHeader('Cache-Control', 'private, max-age=60')
  res.status(200).json({
    sentCount,
    receivedCount,
    total,
    score: rawScore,
    letterGrade,
    breakdown: `Email: ${sentCount} sent, ${receivedCount} received today → ${rawScore} pts`,
  })
}
