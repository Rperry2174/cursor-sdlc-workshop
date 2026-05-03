# Kinpala Carpool — pilot readiness

Use this checklist before inviting a small group of real parents. It covers **deploy**, **auth**, **joining a team**, a short **parent playbook**, and **where to look when something breaks**.

For a **repeatable production cut** (ordered Supabase + Vercel steps) and a **numbered smoke script on the live URL**, use **[Production deploy & smoke](./PRODUCTION_DEPLOY_AND_SMOKE.md)** and run it before every pilot wave or material infra change.

---

## 1. Deploy (lock this first)

### Supabase (database + auth + Edge Functions)

1. **Project** — Use one dedicated Supabase project for the pilot (not your personal scratch project unless everyone agrees).
2. **Migrations** — Apply every SQL file under `migrations/` **in numeric order** on that project (`001` … `015`, etc.). The app assumes this schema + RLS + RPCs exist.
3. **Edge Functions** — Deploy functions from `supabase/functions/` (at minimum `notify-team-leg-claimed` if you rely on claim/release/sub emails). For **multi-stop maps and drive-time hints** on Today / Leg detail / Active ride, also deploy:
   - `compute-leg-route` — builds ordered stops for a leg, geocodes them server-side, calls **Google Directions** (JSON), returns segment durations and an optional polyline. The API key never ships to the browser.
   - `geocode-address` — single-address geocode via **Google Geocoding** when the app runs in Supabase mode (replaces client-side Nominatim for production).
4. **Secrets** — In Supabase → Project Settings → Edge Functions → Secrets, set at least:
   - `RESEND_API_KEY`
   - `RESEND_FROM` (must match a verified sender/domain in Resend)
   - **`GOOGLE_MAPS_API_KEY`** — required for `compute-leg-route` and `geocode-address` (enable **Directions API** and **Geocoding API** on the same Google Cloud project; keep the key server-only in Edge secrets).
5. **Redeploy functions** after changing function code (emails will not update until you do).

### Front end (Vercel or similar)

1. **Environment variables** (production build) must match the **same** Supabase project:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. **Rebuild** after changing env vars.
3. **Smoke test** on the production URL: sign in, open Today, claim a leg, release / sub flow once.

### Sanity checks

- [ ] Migrations applied; no failed statements in Supabase SQL history  
- [ ] RLS enabled on public tables (see `002_rls_policies.sql`)  
- [ ] Edge secrets set; test email received after a claim (optional but strongly recommended)  
- [ ] Vercel env points at the same project you migrated  
- [ ] **[Production deploy & smoke](./PRODUCTION_DEPLOY_AND_SMOKE.md)** completed on the **production URL** (or waivers documented there) before inviting parents

---

## 2. Auth (magic link)

The app uses **Supabase Auth** with **magic links** (see `src/data/onboardingSupabase.js` and the onboarding wizard).

### In Supabase Dashboard → Authentication → URL configuration

1. **Site URL** — Set to your deployed app origin (e.g. `https://your-app.vercel.app`).
2. **Redirect URLs** — Add the same origin and any paths you use after login (wildcard `https://your-app.vercel.app/**` is convenient for pilots).

If magic links open the wrong host or loop, fix Site URL / Redirect URLs first.

### Email templates

- Confirm the **Auth** email provider is configured (Supabase default or custom SMTP).
- For pilots, send yourself a link and complete the flow once on **mobile** and **desktop**.

---

## 3. Joining a team (invite flow)

1. **Organizer** creates a team during onboarding (or uses an existing team’s invite code from Profile).
2. **Invitee** completes onboarding and enters the **invite code** when prompted.
3. Confirm the invitee sees the team schedule and can claim or view legs.

RPCs such as `find_team_by_invite_code` and `complete_onboarding` must be granted to `authenticated` (already in migrations). If join fails, check Supabase **API logs** and browser **Network** tab for the failing RPC and message.

---

## 4. Playbook (share with pilot parents)

**What Kinpala is for**

- See who is driving which **leg** (drop-off or pick-up is a separate leg).
- Claim open drives, add your kid to a car that has space, or mark your kid out / absent.
- When you need a **sub**, the app opens a request your team can accept (first accept wins).

**What to expect**

- Updates are **live** when the app is open (Supabase Realtime). Email is a backup for some coverage changes (after Edge Function deploy + Resend setup).
- **Maps** — Drivers see **Apple Maps** and **Google Maps** buttons with the full ordered stop list (your home → passenger homes → venue, or the reverse for pick-up legs). **Google** supports more waypoints in one URL; **Apple Maps** uses repeated destinations and may differ slightly on very long routes. On iPhone, Apple Maps is often the default choice; **Google Maps** is a reliable fallback (especially on Android). Very large carpools may **cap stops in external links** (first ten addresses) so URLs stay reliable; the in-app **ride** map still lists every stop, and with Supabase routing it can show a **road-following line** from Google Directions on top of OpenStreetMap tiles.
- **Drive time** — When Supabase and the routing Edge function are configured, the app may show an approximate **total drive time** and a **“leave by”** hint for drop-off legs (event start minus drive time minus a small buffer). Times are indicative (traffic varies); follow local rules and your own judgment.
- **“Ride legs”** — One practice with drop-off and pick-up counts as **two legs** (two assignments), not necessarily two physical seats in one car.

**If something looks wrong**

1. Pull to refresh / reopen the app.  
2. Confirm you used the **same email** you signed up with.  
3. Contact the pilot organizer (you) with **what you tapped** and **roughly what time**.

**Known limitations (typical pilot)**

- No native push notifications yet (email + in-app when open).  
- Some organizer fixes may still use Supabase **Table Editor** (e.g. correcting a mis-imported leg capacity) until admin tools exist.

---

## 5. Logs and debugging

| What | Where |
|------|--------|
| Edge Function runs, errors, `console` from Deno | Supabase → **Edge Functions** → select function → **Logs** |
| Auth sign-in / magic link issues | Supabase → **Authentication** → **Users** + **Logs** |
| API / PostgREST / RPC errors | Supabase → **Logs** → **Postgres** or API gateway logs as available |
| Email delivery | [Resend](https://resend.com) dashboard → Emails |
| Client errors | Browser **DevTools** → **Console** / **Network** (failed `rpc` or `rest` calls) |

When reporting a bug, capture: **user**, **time (with timezone)**, **team**, **leg or event name**, and a **screenshot** or the **error text** from the toast.

---

## 6. After the pilot

- Export feedback themes (confusing copy, failed flows, missing profile fields).  
- Triage: **data fixes** (SQL) vs **product fixes** (app changes).  
- Re-run the deploy checklist for any new migration or function before rolling out again.
- Re-run **[Production deploy & smoke](./PRODUCTION_DEPLOY_AND_SMOKE.md)** (at least Parts D–E4) on the live URL after infra changes.
