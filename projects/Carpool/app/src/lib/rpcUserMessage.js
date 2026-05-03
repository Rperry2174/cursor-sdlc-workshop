/**
 * Maps Supabase RPC `reason` codes (and a few raw DB errors) to short
 * user-facing strings for toasts. Keep in sync with SQL in migrations
 * (claim_leg, release_leg, seat_child_on_leg, open_sub_request_for_leg,
 * accept_sub_request, mark_child_absence).
 */

const RPC_REASONS = {
  taken: 'Someone else just claimed this leg.',
  not_found: 'This leg no longer exists or was removed.',
  leg_not_found: 'This leg no longer exists or was removed.',
  not_member: 'You are not on this team for that leg.',
  not_driver: 'Only the assigned driver can do that for this leg.',
  full: 'This car is full — no seats left.',
  already_seated: 'Your child is already on this ride.',
  not_your_child: 'That child is not linked to your account.',
  closed: 'This sub request was already filled or closed.',
  leg_missing: 'That ride is no longer available.',
  cannot_accept_own: 'You cannot accept your own sub request.',
  requires_emergency: 'Too close to departure — open the leg and use emergency options, or call your team.',
  sub_already_open: 'A sub request is already open for this leg.',
  no_parent: 'Your profile is not linked. Sign out and complete onboarding again.',
  not_signed_in: 'Sign in to continue.',
  parent_not_found: 'Your profile was not found. Try signing in again.',
};

const DEFAULT_RPC = 'Something went wrong. Try again, or ask a teammate.';

/**
 * @param {string | undefined | null} reason
 * @param {string} [fallback]
 * @returns {string}
 */
export function userMessageForRpcReason(reason, fallback = DEFAULT_RPC) {
  if (reason == null || reason === '') return fallback;
  if (Object.prototype.hasOwnProperty.call(RPC_REASONS, reason)) {
    return RPC_REASONS[reason];
  }
  return fallback;
}

/**
 * PostgREST errors (RLS, network) — avoid dumping huge policy text in toasts.
 * @param {string | undefined | null} message
 * @returns {string}
 */
export function userMessageForDataError(message) {
  if (message == null || message === '') return DEFAULT_RPC;
  const m = String(message);
  if (/permission denied|row-level security|RLS/i.test(m)) {
    return 'You cannot change that right now. Refresh the page and try again.';
  }
  if (/JWT expired|Invalid JWT|refresh token|session/i.test(m)) {
    return 'Your session expired. Sign in again.';
  }
  if (/network|fetch failed|Failed to fetch/i.test(m)) {
    return 'Network problem. Check your connection and try again.';
  }
  if (m.length > 140) return `${m.slice(0, 137)}…`;
  return m;
}
