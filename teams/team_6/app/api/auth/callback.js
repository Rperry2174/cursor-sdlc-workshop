/**
 * OAuth callback: exchange code for tokens, store refresh_token in cookie, redirect to app.
 */
export default async function handler(req, res) {
  const { code, error, state } = req.query
  const baseUrl = process.env.APP_URL || `https://${process.env.VERCEL_URL || 'localhost:5176'}`
  const appOrigin = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`
  const redirectUri = `${appOrigin}/api/auth/callback`
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (error) {
    res.redirect(302, `${appOrigin.replace(/\/$/, '')}/?gmail_error=${encodeURIComponent(error)}`)
    return
  }

  if (!code || !clientId || !clientSecret) {
    res.redirect(302, `${appOrigin.replace(/\/$/, '')}/?gmail_error=missing_config`)
    return
  }

  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  })

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (!tokenRes.ok) {
    const err = await tokenRes.text()
    res.redirect(302, `${appOrigin.replace(/\/$/, '')}/?gmail_error=token_failed`)
    return
  }

  const tokens = await tokenRes.json()
  const refreshToken = tokens.refresh_token

  if (!refreshToken) {
    res.redirect(302, `${appOrigin.replace(/\/$/, '')}/?gmail_error=no_refresh_token`)
    return
  }

  // Store refresh token in httpOnly cookie (same site; in production use Secure)
  const isProd = appOrigin.startsWith('https://') && !appOrigin.includes('localhost')
  res.setHeader('Set-Cookie', [
    `gmail_refresh=${encodeURIComponent(refreshToken)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${isProd ? '; Secure' : ''}`,
  ])

  res.redirect(302, `${appOrigin.replace(/\/$/, '')}/?gmail_connected=1`)
}
