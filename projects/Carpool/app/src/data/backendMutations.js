import { getSupabase, isSupabaseConfigured } from './supabase.js';

/**
 * Update the signed-in parent's own row (name, phone, default_seats).
 * RLS policy `parents_update_self` must allow this on the target project.
 */
export async function updateBackendParentProfile({ name, phone, default_seats: defaultSeats }) {
  if (!isSupabaseConfigured()) {
    return { ok: false, skipped: true, reason: 'supabase_not_configured' };
  }

  const supabase = getSupabase();
  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError) return { ok: false, reason: userError.message };
  const authUserId = userResult?.user?.id;
  if (!authUserId) return { ok: false, reason: 'not_signed_in' };

  const trimmedName = typeof name === 'string' ? name.trim() : '';
  if (!trimmedName) return { ok: false, reason: 'Name is required.' };

  let seats = Number(defaultSeats);
  if (!Number.isFinite(seats)) seats = 4;
  seats = Math.min(15, Math.max(1, Math.round(seats)));

  const phoneVal = phone == null || String(phone).trim() === '' ? null : String(phone).trim();

  const { data: parent, error: findErr } = await supabase
    .from('parents')
    .select('id')
    .eq('auth_user_id', authUserId)
    .maybeSingle();
  if (findErr) return { ok: false, reason: findErr.message };
  if (!parent) return { ok: false, reason: 'parent_not_found' };

  const { error: updateErr } = await supabase
    .from('parents')
    .update({
      name: trimmedName,
      phone: phoneVal,
      default_seats: seats,
    })
    .eq('id', parent.id);

  if (updateErr) return { ok: false, reason: updateErr.message };
  return { ok: true };
}

export async function updateBackendChildTeams(childId, teamIds, { allowedTeamIds = [] } = {}) {
  if (!isSupabaseConfigured()) {
    return { ok: false, skipped: true, reason: 'supabase_not_configured' };
  }

  const allowed = allowedTeamIds.length ? allowedTeamIds : teamIds;
  const supabase = getSupabase();

  if (allowed.length > 0) {
    const { error: deleteError } = await supabase
      .from('child_teams')
      .delete()
      .eq('child_id', childId)
      .in('team_id', allowed);

    if (deleteError) return { ok: false, reason: deleteError.message };
  }

  const rows = teamIds
    .filter((teamId) => allowed.includes(teamId))
    .map((teamId) => ({ child_id: childId, team_id: teamId }));

  if (rows.length === 0) return { ok: true };

  const { error: insertError } = await supabase
    .from('child_teams')
    .insert(rows);

  if (insertError) return { ok: false, reason: insertError.message };
  return { ok: true };
}
