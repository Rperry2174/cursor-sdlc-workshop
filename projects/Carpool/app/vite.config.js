import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Tiny dev-only middleware that proxies a remote ICS calendar feed.
 *
 * The browser can't fetch most webcal://, GameChanger, Apple iCloud,
 * or Google Calendar URLs directly because of CORS. This middleware
 * lets the demo do `fetch('/api/ics?url=https://...')` and get the
 * raw .ics body back. In production this would live in our backend.
 */
function icsProxy() {
  return {
    name: 'carpool-ics-proxy',
    configureServer(server) {
      server.middlewares.use('/api/ics', async (req, res) => {
        try {
          const u = new URL(req.url, 'http://localhost');
          let target = u.searchParams.get('url');
          if (!target) {
            res.statusCode = 400;
            res.end('Missing url parameter');
            return;
          }
          if (target.startsWith('webcal://')) target = 'https://' + target.slice('webcal://'.length);
          if (!target.startsWith('http')) {
            res.statusCode = 400;
            res.end('Only http(s) and webcal URLs are allowed');
            return;
          }

          const upstream = await fetch(target, {
            headers: { 'User-Agent': 'CarpoolDemo/1.0 (+ICS importer)' },
            redirect: 'follow',
          });
          if (!upstream.ok) {
            res.statusCode = upstream.status;
            res.end(`Upstream returned ${upstream.status}`);
            return;
          }
          const body = await upstream.text();
          res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
          res.setHeader('Cache-Control', 'no-store');
          res.end(body);
        } catch (err) {
          res.statusCode = 500;
          res.end(`ICS proxy error: ${err.message}`);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), icsProxy()],
});
