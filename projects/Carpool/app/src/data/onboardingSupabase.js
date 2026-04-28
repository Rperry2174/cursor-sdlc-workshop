import { getSupabase, isSupabaseConfigured } from './supabase.js';

/**
 * First Supabase-backed write path.
 *
 * We require a real Supabase auth session before calling the RPC. Email
 * magic-link auth creates a durable user that can be restored across devices,
 * unlike the anonymous-auth pilot we used for the first backend write slice.
 */
export async function getCurrentSupabaseSession() {
  if (!isSupabaseConfigured()) {
    return { ok: false, skipped: true, reason: 'supabase_not_configured' };
  }

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error) return { ok: false, reason: error.message };
  if (!data.session) return { ok: false, reason: 'not_signed_in' };
  return { ok: true, session: data.session };
}

async function exchangeMagicLinkCodeIfPresent(supabase) {
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  if (!code) return { ok: true, exchanged: false };

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return { ok: false, reason: error.message };

  url.searchParams.delete('code');
  url.searchParams.delete('state');
  window.history.replaceState({}, document.title, url.toString());
  return { ok: true, exchanged: true };
}

export async function verifyMagicLinkSession(expectedEmail) {
  if (!isSupabaseConfigured()) {
    return { ok: false, skipped: true, reason: 'supabase_not_configured' };
  }

  const supabase = getSupabase();
  const exchange = await exchangeMagicLinkCodeIfPresent(supabase);
  if (!exchange.ok) return exchange;

  const sessionResult = await getCurrentSupabaseSession();
  if (!sessionResult.ok) return sessionResult;

  const sessionEmail = sessionResult.session.user?.email?.toLowerCase();
  if (!sessionEmail || sessionEmail !== expectedEmail.trim().toLowerCase()) {
    return { ok: false, reason: 'email_mismatch' };
  }

  return { ok: true, session: sessionResult.session };
}

export async function sendMagicLink(email) {
  if (!isSupabaseConfigured()) {
    return { ok: false, skipped: true, reason: 'supabase_not_configured' };
  }

  const supabase = getSupabase();
  // Clear the anonymous-auth pilot session (or any stale session) before
  // sending the link. Otherwise getSession() could still return an anonymous
  // user and falsely satisfy the onboarding auth gate.
  await supabase.auth.signOut();

  const redirectTo = `${window.location.origin}${window.location.pathname}`;
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: {
      emailRedirectTo: redirectTo,
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { ok: false, reason: error.message };
  }

  return { ok: true };
}

export async function completeOnboardingInSupabase(payload) {
  if (!isSupabaseConfigured()) {
    return { ok: false, skipped: true, reason: 'supabase_not_configured' };
  }

  const sessionResult = await getCurrentSupabaseSession();
  if (!sessionResult.ok) {
    return sessionResult;
  }

  const supabase = getSupabase();
  const { data, error } = await supabase.rpc('complete_onboarding', { payload });
  if (error) {
    return { ok: false, reason: error.message };
  }
  return { ok: true, data };
}
