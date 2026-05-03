# Production deploy checklist + smoke on the real URL

Use this document when the app is meant to run against a **live** Supabase project and a **public** front-end URL (for example Vercel). It extends the high-level items in [PILOT.md](./PILOT.md) with a **step-by-step deploy order** and an **end-to-end smoke script** you can execute on the production origin.

**Replace placeholders** throughout: `https://YOUR_APP.example`, `YOUR_PROJECT_REF`, test emails, etc.

---

## Part A — Preconditions

- [ ] You have **Admin** access to the Supabase project used for this pilot.
- [ ] You have **deploy** access to the hosting project (e.g. Vercel team) and can set production environment variables.
- [ ] **Google Cloud**: a project with **billing enabled**, and ability to create an API key and enable **Directions API** + **Geocoding API** (for Edge routing and geocode proxy).
- [ ] **Resend** (or your mail provider): verified domain/sender for `RESEND_FROM` if you rely on claim/sub emails.
- [ ] You have **two test accounts** (two real email inboxes) to validate invite + second parent, or you accept single-account smoke with limitations noted below.

---

## Part B — Supabase (database, auth, Edge)

Do these **in order** on the **pilot** Supabase project.

### B1. Database

- [ ] Open **SQL Editor** (or migration pipeline) and confirm there are **no failed** migration batches in history.
- [ ] Apply every file under `migrations/` **in numeric order** (`001_…` through the latest). Do not skip numbers.
- [ ] Confirm **RLS** is enabled on public tables (see `002_rls_policies.sql` and follow-up migrations).
- [ ] Optional: run a quick read-only sanity query (e.g. list `team_members` limit 1) as a privileged user to confirm the schema matches expectations.

### B2. Auth URLs (critical for magic links on the real site)

In **Authentication → URL configuration**:

- [ ] **Site URL** = your production app origin exactly, e.g. `https://YOUR_APP.vercel.app` (no trailing path unless you intend it).
- [ ] **Redirect URLs** include that origin. A wildcard such as `https://YOUR_APP.vercel.app/**` is acceptable for pilots if your security posture allows it.

### B3. Edge Functions — deploy

From the repo root that contains `supabase/` (this app: `projects/Carpool/app`), with CLI logged into the correct project:

- [ ] Deploy **`notify-team-leg-claimed`** (emails on claim / release / sub flows when wired).
- [ ] Deploy **`compute-leg-route`** (server-side Directions + polyline for ETAs and Active ride map).
- [ ] Deploy **`geocode-address`** (server-side geocode when Supabase mode is on).

After **any** secret or code change affecting functions:

- [ ] **Redeploy** the affected functions so new secrets and code are live.

### B4. Edge Functions — secrets

In **Project Settings → Edge Functions → Secrets**, set at least:

| Secret | Used by | Notes |
|--------|---------|--------|
| `SUPABASE_URL` | Usually injected by platform; confirm docs if you set manually | Same project URL. |
| `SUPABASE_ANON_KEY` | Edge code that verifies JWT | Public anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Functions that load legs/events with elevated access | **Never** put in Vite env or client. |
| `GOOGLE_MAPS_API_KEY` | `compute-leg-route`, `geocode-address` | Restrict key (IP / API restrictions) per Google guidance; Directions + Geocoding enabled. |
| `RESEND_API_KEY` | `notify-team-leg-claimed` | If using Resend. |
| `RESEND_FROM` | `notify-team-leg-claimed` | Must match verified sender. |

- [ ] After setting secrets, **redeploy** functions that depend on them.

### B5. Google APIs

In Google Cloud Console for the key above:

- [ ] **Directions API** enabled.
- [ ] **Geocoding API** enabled.
- [ ] **Billing** active (Google returns errors otherwise).
- [ ] Key restrictions configured as tightly as practical (server / IP where possible).

---

## Part C — Front end (e.g. Vercel)

### C1. Production environment variables

Set **production** (not only Preview) variables to the **same** Supabase project you configured above:

- [ ] `VITE_SUPABASE_URL` = `https://YOUR_PROJECT_REF.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = project **anon** public key (not service role)

**Do not** set `GOOGLE_MAPS_API_KEY` in Vite for this architecture; routing keys stay in Edge secrets only.

### C2. Build and domain

- [ ] Trigger a **production deployment** after env vars are saved (Vercel: redeploy or empty commit).
- [ ] Open `https://YOUR_APP…` over **HTTPS** and confirm no mixed-content or certificate warnings.

---

## Part D — Quick post-deploy checks (5 minutes)

On the **production URL**, in a **private window** (no stale auth):

- [ ] App shell loads; no blank white screen.
- [ ] Open DevTools **Console**: no immediate red errors on first paint (PostHog or other third-party noise may be ignorable if known).
- [ ] **Network**: requests go to **your** Supabase host (`YOUR_PROJECT_REF.supabase.co`), not localhost or another project.

---

## Part E — End-to-end smoke on the real URL

Execute on **production** with a pilot-like team that already has at least **one upcoming event** and **carpool legs** (create via app or seed in Supabase—whatever your pilot uses). Use **mobile Safari** or **Chrome Android** for at least one pass if parents will use phones.

**Record**: date/time, browser, user role, pass/fail, screenshot or HAR for failures.

### E1. Auth

1. Open `https://YOUR_APP…` → start **sign in** / magic link.
2. **Expected**: Email arrives; link opens **production** origin (not localhost); session establishes; you land on Today or onboarding.
3. **If fail**: Supabase **Site URL** / **Redirect URLs**; spam folder; Auth logs.

### E2. Team + schedule visibility

4. Complete or skip onboarding until you see **Today** (or schedule) with your team’s events.
5. **Expected**: Events and legs visible; no repeated “could not load” toasts.
6. **If fail**: RLS policies; `team_members`; user completed onboarding RPC.

### E3. Leg detail (Supabase UUID leg)

7. Tap an event or leg → **Leg detail** for a leg stored in Supabase (UUID in URL or backend detail loads).
8. **Expected**: Driver, passengers, actions render; no infinite spinner.
9. **If fail**: `loadBackendLegDetail` path; Network tab for `rest`/`rpc` errors.

### E4. Claim / release (driver)

10. As a user allowed to drive, **claim** an open leg (or confirm already claimed).
11. **Expected**: Toast success; leg shows you as driver; Realtime may update other tabs.
12. **Optional**: **Release** leg (or sub flow) once; confirm state returns and no hard error.
13. **If fail**: RPC `claim_leg` / `release_leg` grants and logs; Edge `notify-team-leg-claimed` logs if email expected.

### E5. Seat / unseat (passenger parent)

14. As another parent (second account) or same account if allowed, **add/remove** a child on a seat where policy allows.
15. **Expected**: Seat count updates; toasts match outcome.
16. **If fail**: RLS on `seats`; RPC or client path in Network tab.

### E6. Maps deep links (driver)

17. From **Today** “next drive” or **Leg detail**, tap **Apple Maps** and **Google Maps** (new tab is fine).
18. **Expected**: Maps opens with **multiple stops** when applicable; no obviously empty route.
19. **If fail**: Addresses missing on parents/event; truncation message if many stops; compare with [PILOT.md](./PILOT.md) maps section.

### E7. Routing + Active ride (Supabase + Google secret)

20. As **assigned driver**, open **Active ride** for that leg.
21. **Expected**: If Edge + Google are configured: **drive time** hints and/or **blue route** on map when polyline returns; **Google → next** opens a two-stop directions URL between consecutive stops.
22. **If no blue line / no ETA**: Supabase Edge logs for `compute-leg-route` (`missing_google_maps_key`, `directions_error`, etc.); Google billing and API enablement.

### E8. Geocode proxy (optional but recommended)

23. With Supabase on, trigger a flow that **geocodes** a non-cached address (e.g. new venue text).
24. **Expected**: Lat/lng resolves or graceful fallback; Edge `geocode-address` logs show success, not 503 missing key.
25. **If fail**: `geocode-address` deploy + `GOOGLE_MAPS_API_KEY`; client still must not contain server key.

### E9. Email (if in scope)

26. After **claim** (or release/sub if you test those), check **Resend** dashboard and inbox.
27. **Expected**: Email delivered to teammates per product rules, or intentional skip documented.
28. **If fail**: `RESEND_*` secrets; `notify-team-leg-claimed` logs; `RESEND_FROM` domain verification.

---

## Part F — Sign-off

- [ ] **Part B–D** complete with no blocking failures.
- [ ] **Part E** sections **E1–E6** pass on production (minimum bar for “parents can coordinate”).
- [ ] **E7–E9** passed or explicitly waived with a written reason (e.g. “routing deferred; maps links only”).
- [ ] Pilot organizer has **saved**: production URL, Supabase project ref, and who to contact for outages.

When anything changes (new migration, new Edge function, env var), re-run **at least Part D + E1–E4** before inviting new families.
