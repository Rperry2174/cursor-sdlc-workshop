import { getSupabase, isSupabaseConfigured } from './supabase.js';

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
