/**
 * Lightweight PostHog wrapper.
 *
 * Why a wrapper instead of importing posthog-js everywhere:
 *   1. Graceful no-op when VITE_POSTHOG_KEY isn't set (works in local dev /
 *      forks / preview branches without anyone needing to provision a key).
 *   2. Single chokepoint to swap providers later (Statsig, Mixpanel) without
 *      touching dozens of call sites.
 *   3. Keeps a stable surface (`identify`, `capture`, `reset`) regardless of
 *      whether we ever bolt on a server-side proxy for first-party domain
 *      analytics.
 *
 * Configuration: set VITE_POSTHOG_KEY (and optionally VITE_POSTHOG_HOST,
 * defaults to https://us.i.posthog.com) in .env.local. Without it, every
 * call here is a console.debug — no network, no cookies, no fingerprint.
 */

import posthog from 'posthog-js';

const KEY = import.meta.env.VITE_POSTHOG_KEY;
const HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

let initialized = false;

export function initAnalytics() {
  if (initialized) return;
  if (!KEY) {
    if (import.meta.env.DEV) {
      console.debug('[analytics] no VITE_POSTHOG_KEY set — running in no-op mode');
    }
    initialized = true;
    return;
  }

  posthog.init(KEY, {
    api_host: HOST,
    // We're a kids-data app — be conservative by default. No autocapture of
    // every click (which can leak input values), no session replay.
    autocapture: false,
    capture_pageview: true,
    capture_pageleave: true,
    disable_session_recording: true,
    // Until we ship a proper consent flow, treat everyone as opted-in but
    // strip IP and use anonymous IDs. Tighten this when COPPA consent ships.
    persistence: 'localStorage',
    ip: false,
  });
  initialized = true;
}

/**
 * Tie subsequent events to a stable parent ID. Call once per session right
 * after auth resolves (or after onboarding completes for fresh signups).
 */
export function identify(parentId, traits = {}) {
  if (!initialized) initAnalytics();
  if (!KEY) {
    console.debug('[analytics] identify', parentId, traits);
    return;
  }
  posthog.identify(parentId, traits);
}

/**
 * Fire-and-forget event. `props` should be small + non-PII (no names, phone
 * numbers, addresses). Stick to IDs, counts, enums.
 */
export function capture(event, props = {}) {
  if (!initialized) initAnalytics();
  if (!KEY) {
    console.debug('[analytics]', event, props);
    return;
  }
  posthog.capture(event, props);
}

/**
 * Wipe identity on sign-out / "start fresh." Prevents the next user on the
 * same device from inheriting the previous user's events.
 */
export function resetAnalytics() {
  if (!KEY) return;
  posthog.reset();
}
