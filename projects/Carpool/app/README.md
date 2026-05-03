# Carpool — Phase 1+2+3 Prototype

Mobile-viewport React web app that demonstrates the Phase 1, 2, and 3 flows from the
[Neighborhood Carpool App Blueprint](../../../.cursor/plans/). Designed to be
ported to React Native + Expo with Supabase when ready to ship to phones —
the data layer in `src/data/` mirrors the Supabase schema 1:1.

## Pilot (real parents)

See **[docs/PILOT.md](./docs/PILOT.md)** for deploy checklist, Supabase auth URL configuration, invite/join verification, a short parent playbook, and where to read logs (Edge Functions, Resend, API).

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173 in a browser. For the right effect, use Chrome
DevTools to switch to a phone viewport (iPhone 14 / Pixel 7 work well).

## Demo controls

- **Top-right "Demo: …" pill** — switch between the four seeded parents to
  see the app from different perspectives. Sarah (the admin) is the default.
  Includes a "Reset demo data" option that wipes localStorage and re-seeds.
- All data lives in `localStorage` under the key `carpool.db.v1`.

## What's in here

### Phase 1 screens
- **Today** — date scrubber, alert banner, three card states (your-turn /
  confirmed / needs-driver), color-coded family avatars
- **Leg detail** — driver, passengers, one-tap call, claim/assign actions,
  active-ride status buttons (driver only), release-leg with the emergency
  cancellation path
- **Schedule** — chronological list of all events with open-slot indicators
- **Profile** — your kids, your teams, invite codes (copyable), team rosters
- **Inbox** — notification feed with unread badges
- **Create group** — manual group creation that generates an invite code
- **Invitee landing** — preview of what an invitee sees

### Phase 2+3 screens (added)
- **Sub-response decision** — full-screen experience when someone needs a sub
  for a leg. Shows requester avatar, reason, kids in the carpool, and big
  Yes / No buttons. First-accept-wins is enforced.
- **Day-of pickup hero card** (on Today) — appears within ~90 min of any leg
  you're driving. Big countdown, Start route (deep-links to maps + posts
  "on my way"), I'm late, and a path to full ride controls.
- **Group chat** (per team) — pinned event card at the top, system-event
  messages when claims/releases happen, quick-chip shortcuts for "On my way",
  "Running late", "Need a sub", "Thanks!".
- **My recurring driving** — every "Repeat every Wednesday" toggle now
  materializes 12+ weeks of leg claims, and this inventory screen lets you
  Pause / Resume / Cancel each commitment with a coverage progress bar.
- **Blackout dates** — type chips (Travel / Work / Sick / Other), date range,
  live "X commitments will be released" preview, and an auto-find-subs job
  that opens broadcast sub_requests when you save.
- **Today's digest recap** — 7pm-style summary with four prioritized
  sections: your-turn-tomorrow, your-kid-needs-a-ride, team still needs
  drivers, recent activity.
- **Notification preferences** — noise meter, three style presets (Quiet /
  Balanced / Detailed), per-type toggles grouped by category, "always alert
  me when MY kid is involved" override, configurable quiet hours, snooze
  for 1h / 4h / 1 day, per-team overrides.
- **Notification onboarding wizard** — 3 steps with predicted weekly volume
  bars per preset.
- **Season balance** (per team) — fairness view for organizers with
  fair-share marker, +above / -below pills, and one-tap nudges.

### Sign-up bottom sheet
Includes the killer "Repeat every Wednesday" toggle that converts a single
claim into ~12 season-long slots (now actually creates and materializes a
`recurring_commitment`), plus the dynamic CTA count.

### Leg lifecycle rules (`src/data/lifecycle.js`)
All four §11 rules from the blueprint are encoded:
- **Claim tie-break** — if two parents claim within 5 seconds, the one with
  earlier `parents.created_at` wins (the late arrival is swapped in even if
  they tapped second)
- **Parent unseat** — blocked within 30 min of pickup (UI shows "call the
  driver directly")
- **Driver release** — outside 30 min, opens a broadcast `sub_request`
  automatically; inside 30 min, requires the **Emergency cancel** path
  (reason required) which alerts every passenger parent to sub in
- **Sub request acceptance** — first-accept-wins, with all the right
  notifications fanned out

## Architecture

```
src/
├── main.jsx              # entry
├── App.jsx               # tab nav + routing
├── theme.css             # design tokens (matches the HTML mockups)
├── components/           # Avatar, Sheet, Toggle, Stepper, Toast, TopNav
├── data/
│   ├── store.js          # localStorage-backed; queries + session
│   ├── seed.js           # demo team, 4 families, 14 days of events, mixed leg states
│   └── lifecycle.js      # leg lifecycle rules from §11 of the blueprint
└── screens/              # Today, Schedule, Profile, LegDetail, NotificationsInbox,
                          # CreateGroup, InviteLanding, SubResponse, Recurring,
                          # Chat, Blackouts, Digest, NotificationPrefs,
                          # NotifWizard, Balance
```

## Porting to production

The `data/` module is the seam. To move to Supabase + React Native:

1. Replace `data/store.js` query/mutation functions with Supabase client
   calls — function signatures stay the same
2. Move `data/lifecycle.js` rules into Supabase Edge Functions / RPCs;
   the JS logic translates almost line-for-line to PL/pgSQL or TypeScript
   on the server
3. Swap `screens/` JSX for React Native components — same component
   structure, same data flow, same lifecycle rules

## What's intentionally **not** here yet

Most things that need a real backend or device runtime stay in the production
build. Phase 4 items still pending:

- Real auth (phone OTP via Supabase Auth + Twilio)
- Push notifications (Expo Push) — the prefs UI is here, the actual
  delivery requires Expo + APNs/FCM
- Lock-screen rich notifications with inline actions (iOS UNNotificationAction
  / Android Action buttons) — native-only
- Schedule sync from GameChanger / TeamSnap / SportsEngine — needs an Edge
  Function poller and OAuth providers
- 7pm digest cron — the screen renders on demand; the actual cron-per-timezone
  job is a Supabase scheduled function
- Live ride map / location sharing — react-native-maps + a realtime channel
- SMS fallback (Twilio) for non-app parents
- Stripe + paid tier rollout

## Try the new flows

1. **Sub request flow**: as Sarah, open Day 0 leg detail (the one Sarah is
   driving). Tap "Release this leg". Switch to Mike via the demo pill — you'll
   see a red banner on Today. Tap it → full sub-response screen → "Yes, I'll
   cover it". Sarah's leg is now Mike's.
2. **Recurring**: open any open leg, "I'll drive this leg", flip the
   "Repeat every Wednesday" toggle, submit. Now go to Profile → My recurring
   driving and watch the coverage bar.
3. **Group chat**: Profile → Team chat. System events from claims/releases
   show up automatically. Quick chips post canned messages.
4. **Blackouts**: Profile → Blackout dates. Pick a range that includes a leg
   you're driving — the live preview will show "X commitments will be
   released" and saving auto-opens sub requests.
5. **Notifications**: Profile → Notifications. Move sliders, watch the noise
   meter recompute. Re-run the wizard from there.
6. **Day-of card**: switch to Mike (he's driving Day 0 drop-off) and open
   Today — there's a giant green hero card with countdown and Start route.
7. **Balance**: Profile → ⚖️ Balance on any team. See who's pulling weight.
