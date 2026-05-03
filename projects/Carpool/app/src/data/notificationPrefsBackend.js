import { getSupabase, isSupabaseConfigured } from './supabase.js';

const DEFAULT_PREFS = {
  style: 'balanced',
  by_type: {},
  by_team: {},
  quiet_hours: { enabled: true, start: '21:00', end: '07:00' },
  always_alert_my_kid: true,
  snoozed_until: null,
  wizard_completed: false,
};

function mergePrefs(row) {
  const blob = row?.prefs_json && typeof row.prefs_json === 'object' ? row.prefs_json : {};
  return {
    ...DEFAULT_PREFS,
    ...blob,
    quiet_hours: { ...DEFAULT_PREFS.quiet_hours, ...(blob.quiet_hours || {}) },
    by_type: { ...DEFAULT_PREFS.by_type, ...(blob.by_type || {}) },
    by_team: { ...DEFAULT_PREFS.by_team, ...(blob.by_team || {}) },
  };
}

async function getSession() {
  if (!isSupabaseConfigured()) {
    return { ok: false, skipped: true, reason: 'supabase_not_configured' };
  }
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error) return { ok: false, reason: error.message };
  if (!data.session) return { ok: false, skipped: true, reason: 'not_signed_in' };
  return { ok: true, supabase };
}

async function resolveParentId(supabase) {
  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError) return { ok: false, reason: userError.message };
  const authUserId = userResult?.user?.id;
  if (!authUserId) return { ok: false, skipped: true, reason: 'not_signed_in' };

  const { data: parent, error } = await supabase
    .from('parents')
    .select('id')
    .eq('auth_user_id', authUserId)
    .maybeSingle();
  if (error) return { ok: false, reason: error.message };
  if (!parent) return { ok: false, reason: 'parent_not_found' };
  return { ok: true, parentId: parent.id, supabase };
}

/**
 * Load merged notification prefs for the signed-in parent.
 * Returns { ok, prefs } or { skipped } / { ok:false, reason }.
 */
export async function loadBackendNotificationPrefs() {
  const session = await getSession();
  if (!session.ok) return session;
  const parentR = await resolveParentId(session.supabase);
  if (!parentR.ok) return parentR;

  const { data: row, error } = await parentR.supabase
    .from('notification_preferences')
    .select('parent_id, push_enabled, sms_enabled, digest_time, quiet_hours_start, quiet_hours_end, prefs_json')
    .eq('parent_id', parentR.parentId)
    .maybeSingle();

  if (error) return { ok: false, reason: error.message };

  if (!row) {
    return {
      ok: true,
      prefs: mergePrefs(null),
      rowExists: false,
      parentId: parentR.parentId,
      supabase: parentR.supabase,
    };
  }

  return {
    ok: true,
    prefs: mergePrefs(row),
    rowExists: true,
    parentId: parentR.parentId,
    supabase: parentR.supabase,
    legacyRow: row,
  };
}

/**
 * Deep-merge `patch` into prefs_json and upsert the row.
 */
export async function saveBackendNotificationPrefs(patch) {
  const loaded = await loadBackendNotificationPrefs();
  if (!loaded.ok) return loaded;

  const next = {
    ...loaded.prefs,
    ...patch,
    quiet_hours: patch.quiet_hours
      ? { ...loaded.prefs.quiet_hours, ...patch.quiet_hours }
      : loaded.prefs.quiet_hours,
    by_type: patch.by_type ? { ...loaded.prefs.by_type, ...patch.by_type } : loaded.prefs.by_type,
    by_team: patch.by_team ? { ...loaded.prefs.by_team, ...patch.by_team } : loaded.prefs.by_team,
  };

  const { error } = await loaded.supabase.from('notification_preferences').upsert(
    {
      parent_id: loaded.parentId,
      prefs_json: next,
    },
    { onConflict: 'parent_id' },
  );

  if (error) return { ok: false, reason: error.message };
  return { ok: true, prefs: next };
}
