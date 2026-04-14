# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Snipster

**One-line Description:** A frontend-only booking demo where you pick a barber, pick a service, pick a time slot, and walk through a mock checkout — no real calendar, no real payment.

**Type:** Web App (React + Vite, single-page, frontend only)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes**
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!**
- This exercise is about learning the git flow and understanding where Cursor's features fit into the SDLC

### Scaled-Down Context

The original idea was "scheduling and payment app for a barber." To stay within workshop rules (no backend, database, auth, or external APIs), we dropped:
- Real-time multi-user calendar sync
- Real payment processing (Stripe/etc.)
- User accounts / login

What we kept (the fun parts):
- The **flow**: choose barber → choose service → choose time → "pay" → confirmation
- Visual polish: cards, a booking summary, a receipt
- Interactive feel: clickable tiles, live total, success animation

Everything is state-driven with `useState` and a hardcoded `data/` folder. Booking history persists in `localStorage`.

### Bad Project Ideas (Too Big!) — avoided
- No database (barbers/services/slots hardcoded in JS)
- No auth (single-user demo)
- No payment API (fake card form, mock "Pay" button)
- No routing library (step state drives which screen shows)

---

## Base MVP

> Build the minimal working version of your project first.

**What the MVP includes:**
- Single-page React app with a **step-based booking flow** driven by `useState`:
  1. **Pick a barber** — 3 hardcoded barbers shown as cards (name, specialty, price modifier).
  2. **Pick a service** — 3 hardcoded services (Haircut, Beard Trim, Haircut + Beard Combo) with base prices.
  3. **Pick a time slot** — a grid of ~6 hardcoded slots for "today." Clicking one selects it.
  4. **Checkout** — summary of selections, a fake card form (name, number, CVC — no validation beyond "required"), and a "Pay" button.
  5. **Confirmation** — "Booking confirmed!" screen with the barber, service, time, and total.
- All state lives in `App.jsx` (`currentStep`, `selectedBarber`, `selectedService`, `selectedSlot`).
- Clean, modern styling (CSS in `App.css` or inline) — presentable on a projected screen.
- No external libraries beyond React.

**What it does NOT include (stretch goals):**
- Tip selection on checkout
- Persistent booking history
- Confetti / success animation
- Editing or canceling a booking
- More than one day of availability
- Multiple barbershops / locations

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Tip Selector
- **Description:** On the checkout screen, add preset tip buttons (15% / 20% / 25% / Custom). Selecting one updates the **Total** line live. Tip amount is included in the confirmation receipt.
- **Files to create:**
  - `src/components/TipSelector.jsx` — renders the tip buttons + optional custom input; emits `onTipChange(amount)`
  - `src/components/TipSelector.css` — styling for the tip button group
  - (modify) `src/Checkout.jsx` — hold `tipAmount` in state, show live total, pass tip into confirmation

### Feature 2: Booking History (localStorage)
- **Description:** After a booking is confirmed, push it to a `bookings` array in `localStorage`. A new "My Past Bookings" panel on the landing screen shows the last 5 bookings with barber, service, date, and total. Survives page refresh.
- **Files to create:**
  - `src/components/BookingHistory.jsx` — reads from `localStorage`, renders the list, handles empty state
  - `src/hooks/useBookings.js` — tiny custom hook: `getBookings()`, `addBooking(booking)`, `clearBookings()`
  - (modify) `src/Confirmation.jsx` — call `addBooking(...)` on mount

### Feature 3: Confirmation Confetti + Fake Receipt
- **Description:** On the confirmation screen, trigger a simple CSS-based confetti burst and render a styled "receipt" card (order #, timestamp, line items, subtotal, tip, total). Order # is `Math.random().toString(36).slice(2, 8).toUpperCase()` — no server needed.
- **Files to create:**
  - `src/components/Confetti.jsx` — renders ~30 animated divs with randomized CSS variables (no library)
  - `src/components/Confetti.css` — keyframes for falling/rotating particles
  - `src/components/Receipt.jsx` — pure presentational component, props: `barber`, `service`, `slot`, `tip`, `total`, `orderId`

---

## Data Stubs (hardcoded — no backend)

> Planned location: `src/data/`

- `src/data/barbers.js` — `[{ id, name, specialty, avatarEmoji, priceModifier }]`
- `src/data/services.js` — `[{ id, name, basePrice, durationMin }]`
- `src/data/slots.js` — hardcoded array of ISO-ish time strings for today (e.g., `"10:00 AM"`, `"10:30 AM"`, …)

---

## Success Criteria

- [ ] MVP runs locally (`npm run dev` in `base_mvp/`)
- [ ] Full booking flow works end-to-end: barber → service → slot → checkout → confirmation
- [ ] At least one PR merged to the original repo
- [ ] Each of the 3 features lives in its own component file (no fat `App.jsx`)
- [ ] Features work without breaking the base app (can be toggled/removed independently)
- [ ] No backend, database, auth, or external API calls introduced
