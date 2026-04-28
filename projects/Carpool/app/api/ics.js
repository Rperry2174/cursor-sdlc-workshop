/**
 * Production ICS proxy — Vercel serverless function.
 *
 * Mirrors the dev-only Vite middleware in vite.config.js so the app
 * can fetch GameChanger / iCloud / Google Calendar feeds without
 * tripping the browser's CORS rules.
 *
 * Lives at /api/ics — same path the app already fetches, so no
 * client changes needed.
 */
export default async function handler(req, res) {
  try {
    let target = req.query?.url;
    if (!target) {
      res.status(400).send('Missing url parameter');
      return;
    }
    if (target.startsWith('webcal://')) {
      target = 'https://' + target.slice('webcal://'.length);
    }
    if (!target.startsWith('http')) {
      res.status(400).send('Only http(s) and webcal URLs are allowed');
      return;
    }

    const upstream = await fetch(target, {
      headers: { 'User-Agent': 'CarpoolDemo/1.0 (+ICS importer)' },
      redirect: 'follow',
    });
    if (!upstream.ok) {
      res.status(upstream.status).send(`Upstream returned ${upstream.status}`);
      return;
    }

    const body = await upstream.text();
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(body);
  } catch (err) {
    res.status(500).send(`ICS proxy error: ${err.message}`);
  }
}
