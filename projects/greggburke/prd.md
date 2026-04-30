# Product Requirements Document (PRD)

> **Instructions:** This is your project specification. Fill in the sections below to define what you're building.

---

## Project Overview

**Project Name:** Riverfront RV Park Booking

**One-line Description:** A booking site for Riverfront RV Park where guests browse 107 spots along the Ohio River, pick dates, and reserve — styled to match the real riverfront-rv.com.

**Type:** Web App (React + Vite)

**Design Reference:** [https://riverfront-rv.com/](https://riverfront-rv.com/)

---

## Guidelines

### Keep It Small!
- Your MVP should be buildable in **10 minutes**
- Think "proof of concept" not "production ready"
- If it sounds ambitious, make it simpler
- **Use Cursor to help you plan this!**
- This exercise is about learning the git flow and understanding where Cursor's features fit into the SDLC

### Design Direction
- Match the look and feel of the real site at riverfront-rv.com
- Earthy/natural color palette: dark greens, warm browns/tans, white text
- Scenic hero banner with the tagline "Make your summer Unforgettable!"
- Full-width sections with centered content and generous spacing
- Clean, modern sans-serif typography

### Technical Constraints
- Frontend-only — no backend, database, authentication, or external APIs
- Inventory is a hardcoded JavaScript array (107 spot objects)
- Bookings stored in React state (resets on refresh)
- Stripe payment is stubbed (fake form, no real charges)

---

## Real Site Data

### Site Types and Pricing

**Riverfront Sites (#1–62) — 62 spots along the Ohio River shoreline**

| Rate Tier | Price | Notes |
|---|---|---|
| Daily (Sun–Wed) | $55/night | 2-night minimum |
| Weekend (Thu–Sun) | $65/night | 2-night minimum |
| Holidays | $75/night | 2-night minimum |
| Weekly | $350/week | Mon–Sun |
| Monthly | $850/month | 30 nights |

**Four Season Sites (#63–107) — 45 spots, open year-round**

| Rate Tier | Price | Notes |
|---|---|---|
| Daily (Sun–Wed) | $45/night | 2-night minimum |
| Weekend (Thu–Sun) | $55/night | 2-night minimum |
| Holidays | $65/night | 2-night minimum |
| Monthly | $650/month | 30 nights |

### Amenities (all sites)
- Electric (20/30/50 Amp)
- Water
- Sewage
- WiFi
- River Access (Beach, Canoe, Kayak)
- Fire rings and picnic tables

---

## Base MVP

> Build the minimal working version of your project first.

**What the MVP includes:**
- A `data.js` file with a hardcoded array of 107 spot objects, each with `id`, `number`, `type` ("Riverfront" or "Four Season"), `status`, and pricing per tier (daily, weekend, holiday)
- A **hero banner** matching the riverfront-rv.com style — park name, scenic background, "Make your summer Unforgettable!" tagline, and a "Book Now" CTA
- A scrollable **card list** of available spots grouped by type, showing spot number, site type, and nightly price
- **Date pickers** for check-in and check-out — price auto-calculates based on day-of-week pricing tiers
- A **"Book Now" button** on each spot card that marks it as booked in local React state
- Earthy color scheme and layout inspired by the real site

**What it does NOT include (stretch goals):**
- Payment form / Stripe integration
- Booking confirmation screen
- Visual park map
- Search/filtering
- Amenity detail display

---

## Features

> Plan out the features you want to add after the MVP is working. Each feature should be in its own component file to keep things organized.

### Feature 1: Booking Confirmation Screen
- **Description:** After clicking "Book Now," an overlay/panel appears showing a full booking summary: spot number, site type, selected dates, number of nights, price breakdown (weekday vs. weekend rates), and total cost. A "Confirm Booking" button finalizes the reservation.
- **Files to create:** `src/components/BookingConfirmation.jsx`

### Feature 2: Stubbed Stripe Payment Form
- **Description:** A credit card input form (card number, expiry, CVC) that visually resembles a real Stripe checkout. It validates input format on the client side, then returns a fake "Payment Successful" response. Displayed as a step between clicking "Book Now" and seeing the confirmation screen.
- **Files to create:** `src/components/PaymentForm.jsx`

### Feature 3: Visual Park Map
- **Description:** A top-down layout of the park showing all 107 spots as clickable tiles. Color-coded: green for available, red for booked. Riverfront (#1–62) and Four Season (#63–107) sections are visually separated. Clicking a spot on the map selects it for booking.
- **Files to create:** `src/components/ParkMap.jsx`

---

## Architecture

```
src/
├── App.jsx                  ← Main app: state management + page layout
├── App.css                  ← Global styles (earthy color palette)
├── data.js                  ← Hardcoded array of 107 spots with pricing
├── components/
│   ├── HeroBanner.jsx       ← Scenic header with park branding + CTA
│   ├── SpotList.jsx         ← Scrollable card list of available spots
│   ├── DatePicker.jsx       ← Check-in/check-out date selection
│   ├── BookingConfirmation.jsx  ← [Feature 1] Summary overlay
│   ├── PaymentForm.jsx      ← [Feature 2] Stubbed Stripe form
│   └── ParkMap.jsx          ← [Feature 3] Visual top-down map
```

Each post-MVP feature is a self-contained component — adding one does not require rewriting the base MVP.

---

## Success Criteria

- [ ] MVP runs locally with `npm run dev`
- [ ] Spots display with correct pricing by type (Riverfront vs Four Season)
- [ ] Date selection calculates price using the correct tier (weekday/weekend/holiday)
- [ ] Booking a spot updates the UI to show it as unavailable
- [ ] At least one PR merged to the original repo
- [ ] Features work without breaking the base app
