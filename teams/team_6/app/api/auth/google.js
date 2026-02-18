/**
 * Redirects user to Google OAuth consent screen for Gmail read-only access.
 * Requires GOOGLE_CLIENT_ID and VERCEL_URL (or APP_URL) in env.
 */
export default function handler(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const baseUrl = process.env.APP_URL || `https://${process.env.VERCEL_URL || 'localhost:5176'}`
  const redirectUri = `${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/api/auth/callback`

  if (!clientId) {
    res.status(500).json({ error: 'GOOGLE_CLIENT_ID not configured' })
    return
  }

  const scope = encodeURIComponent('https://www.googleapis.com/auth/gmail.readonly')
  const state = Math.random().toString(36).slice(2)
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${state}`

  res.redirect(302, authUrl)
}
