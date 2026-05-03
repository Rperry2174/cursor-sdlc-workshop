import { getSupabase, isSupabaseConfigured } from './supabase.js';

// Resolve the authenticated parent specifically. RLS lets a parent SELECT
// every other parent on a shared team (see policy parents_select_self_or_teammates
// in 002), so a bare `select * from parents limit 1` returns whichever row
// Postgres feels like — which is how Jessica's Profile was rendering Mike's
// name at the top. Filtering on auth_user_id pins it to the caller.
async function loadParent(supabase) {
  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const authUserId = userResult?.user?.id;
  if (!authUserId) return null;

  const { data, error } = await supabase
    .from('parents')
    .select('*')
    .eq('auth_user_id', authUserId)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

async function loadChildrenForParent(supabase, parentId) {
  const { data: links, error: linkError } = await supabase
    .from('parent_children')
    .select('child_id')
    .eq('parent_id', parentId);

  if (linkError) throw linkError;
  const childIds = (links || []).map((row) => row.child_id);
  if (childIds.length === 0) return [];

  const { data: children, error: childError } = await supabase
    .from('children')
    .select('*')
    .in('id', childIds);

  if (childError) throw childError;
  return children || [];
}

async function loadTeamsForParent(supabase, parentId) {
  const { data: memberships, error: memberError } = await supabase
    .from('team_members')
    .select('team_id, parent_id, role, driver_approved, removed_at')
    .eq('parent_id', parentId)
    .is('removed_at', null);

  if (memberError) throw memberError;
  const teamIds = (memberships || []).map((row) => row.team_id);
  if (teamIds.length === 0) return { memberships: [], teams: [], membersByTeamId: {} };

  const { data: teams, error: teamError } = await supabase
    .from('teams')
    .select('*')
    .in('id', teamIds);

  if (teamError) throw teamError;

  const { data: allMemberships, error: allMemberError } = await supabase
    .from('team_members')
    .select('team_id, parent_id, role, driver_approved, removed_at')
    .in('team_id', teamIds)
    .is('removed_at', null);

  if (allMemberError) throw allMemberError;

  const parentIds = [...new Set((allMemberships || []).map((row) => row.parent_id))];
  const { data: parents, error: parentsError } = parentIds.length
    ? await supabase.from('parents').select('*').in('id', parentIds)
    : { data: [], error: null };

  if (parentsError) throw parentsError;

  const parentsById = Object.fromEntries((parents || []).map((parent) => [parent.id, parent]));
  const membersByTeamId = {};
  for (const membership of allMemberships || []) {
    if (!membersByTeamId[membership.team_id]) membersByTeamId[membership.team_id] = [];
    membersByTeamId[membership.team_id].push({
      ...membership,
      parent: parentsById[membership.parent_id] || null,
    });
  }

  return { memberships, teams: teams || [], membersByTeamId };
}

async function loadChildTeams(supabase, teams) {
  const teamIds = teams.map((team) => team.id);
  if (teamIds.length === 0) return [];

  const { data, error } = await supabase
    .from('child_teams')
    .select('team_id, child_id')
    .in('team_id', teamIds);

  if (error) throw error;
  return data || [];
}

export async function loadBackendProfile() {
  if (!isSupabaseConfigured()) {
    return { status: 'unconfigured', data: null, error: null };
  }

  const supabase = getSupabase();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!sessionData.session) {
    return { status: 'signed_out', data: null, error: null };
  }

  const parent = await loadParent(supabase);
  if (!parent) {
    return { status: 'no_parent', data: null, error: null };
  }

  const [children, teamBundle] = await Promise.all([
    loadChildrenForParent(supabase, parent.id),
    loadTeamsForParent(supabase, parent.id),
  ]);
  const childTeams = await loadChildTeams(supabase, teamBundle.teams);

  return {
    status: 'ready',
    data: {
      parent,
      children,
      childTeams,
      memberships: teamBundle.memberships,
      teams: teamBundle.teams,
      membersByTeamId: teamBundle.membersByTeamId,
    },
    error: null,
  };
}
