// @ts-nocheck — this file targets Deno (Supabase Edge Runtime), not the
// project's Node/TypeScript config. The `Deno` global, the `https://esm.sh/...`
// import, and the `Deno.serve` signature are all valid at runtime. The
// project's TypeScript checker doesn't know about Deno, so we suppress its
// complaints here rather than maintaining a parallel tsconfig for one file.

// =============================================================================
// Supabase Edge Function: notify-team-leg-claimed
//
// Sends an email to every other parent on a team when one parent claims or
// releases a carpool leg. Pairs with the realtime UI updates so a parent who
// isn't actively looking at the app still finds out (a) that they're covered
// or (b) that they need to look at coverage.
//
// Invoked from the React client immediately after a successful claim_leg or
// release_leg RPC. The client passes { legId, kind: 'claimed' | 'released' }.
//
// Auth model:
//   - Caller must be an authenticated Supabase user. We require the
//     Authorization: Bearer <jwt> header and reject anonymous calls.
//   - We use a SUPABASE_SERVICE_ROLE_KEY admin client to read auth.users
//     emails (the anon role can't see auth.users.email even with RLS
//     correctly enforced on public tables).
//
// Required env / secrets (configure in Supabase dashboard → Project Settings
// → Functions → Secrets):
//   - RESEND_API_KEY        the secret API key from Resend
//   - RESEND_FROM           default "Kinpala <magic@kinpala.com>" — must match
//                           a verified Resend sender domain
//   - SUPABASE_URL          auto-provided by Supabase
//   - SUPABASE_ANON_KEY     auto-provided by Supabase
//   - SUPABASE_SERVICE_ROLE_KEY  auto-provided by Supabase
// =============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'content-type': 'application/json' },
  });

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const resendApiKey = Deno.env.get('RESEND_API_KEY') ?? '';
const resendFrom = Deno.env.get('RESEND_FROM') ?? 'Kinpala <magic@kinpala.com>';

interface RequestPayload {
  legId: string;
  kind: 'claimed' | 'released';
}

function fmtTime(iso: string | null, timezone: string): string {
  if (!iso) return 'TBD';
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
    timeZoneName: 'short',
  });
}

function buildSubject(
  kind: 'claimed' | 'released',
  driverName: string,
  eventTitle: string,
): string {
  if (kind === 'released') {
    return `${driverName} can no longer drive ${eventTitle} — needs a sub`;
  }
  return `${driverName} is now driving ${eventTitle}`;
}

function joinKidNames(names: string[]): string {
  if (names.length === 0) return 'your kid';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

function buildBody(args: {
  kind: 'claimed' | 'released';
  driverName: string;
  eventTitle: string;
  eventTime: string;
  direction: string;
  recipientKidNames: string[];
  allKidNames: string[];
  appUrl: string;
}): { html: string; text: string } {
  const {
    kind,
    driverName,
    eventTitle,
    eventTime,
    direction,
    recipientKidNames,
    allKidNames,
    appUrl,
  } = args;
  const dirLabel = direction === 'to_event' ? 'drop-off' : 'pick-up';
  const yourKids = joinKidNames(recipientKidNames);
  const carriers = allKidNames.length
    ? `Riders: ${allKidNames.join(', ')}.`
    : '';

  if (kind === 'released') {
    const text = [
      `Heads up: ${driverName} just released the ${dirLabel} for ${eventTitle} (${eventTime}). ${yourKids} no longer has a confirmed driver.`,
      '',
      "It's now an open leg. Open Kinpala to claim it before someone else does, or volunteer in the team chat.",
      '',
      `${appUrl}`,
    ].join('\n');
    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.5;color:#0F172A">
        <p>Heads up: <strong>${driverName}</strong> just released the <strong>${dirLabel}</strong> for <strong>${eventTitle}</strong> (${eventTime}).</p>
        <p><strong>${yourKids}</strong> no longer has a confirmed driver for this leg.</p>
        <p><a href="${appUrl}" style="color:#0F6B42;font-weight:700;text-decoration:none">Open Kinpala →</a></p>
      </div>`;
    return { html, text };
  }

  // Claimed leg but this recipient has no seated kids on the leg (e.g. they
  // opened a sub, pulled their kid out, and someone else claimed — still
  // worth a clear inbox nudge).
  if (kind === 'claimed' && recipientKidNames.length === 0) {
    const text = [
      `${driverName} picked up the ${dirLabel} for ${eventTitle} (${eventTime}).`,
      '',
      'You had asked for coverage on this leg — it now has a confirmed driver.',
      '',
      `${appUrl}`,
    ].join('\n');
    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.5;color:#0F172A">
        <p><strong>${driverName}</strong> picked up the <strong>${dirLabel}</strong> for <strong>${eventTitle}</strong> (${eventTime}).</p>
        <p>You had asked for coverage on this leg — it now has a confirmed driver.</p>
        ${carriers ? `<p style="color:#64748B;font-size:14px">${carriers}</p>` : ''}
        <p><a href="${appUrl}" style="color:#0F6B42;font-weight:700;text-decoration:none">Open Kinpala →</a></p>
      </div>`;
    return { html, text };
  }

  const text = [
    `${driverName} is now driving ${yourKids} to ${eventTitle} (${eventTime}).`,
    carriers ? '' : null,
    carriers || null,
    '',
    "You're covered. No action needed unless you want to coordinate further.",
    '',
    `${appUrl}`,
  ]
    .filter((line) => line !== null)
    .join('\n');
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.5;color:#0F172A">
      <p><strong>${driverName}</strong> is now driving <strong>${yourKids}</strong> to <strong>${eventTitle}</strong> (${eventTime}).</p>
      ${carriers ? `<p style="color:#64748B;font-size:14px">${carriers}</p>` : ''}
      <p>You're covered. No action needed unless you want to coordinate further.</p>
      <p><a href="${appUrl}" style="color:#0F6B42;font-weight:700;text-decoration:none">Open Kinpala →</a></p>
    </div>`;
  return { html, text };
}

async function sendEmail(args: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ ok: boolean; reason?: string; id?: string }> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: resendFrom,
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    return { ok: false, reason: `Resend ${res.status}: ${body.slice(0, 200)}` };
  }

  const data = (await res.json()) as { id?: string };
  return { ok: true, id: data.id };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json(405, { ok: false, reason: 'method_not_allowed' });

  if (!resendApiKey) {
    return json(500, { ok: false, reason: 'RESEND_API_KEY secret is not set' });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json(401, { ok: false, reason: 'missing_auth' });

  let payload: RequestPayload;
  try {
    payload = (await req.json()) as RequestPayload;
  } catch {
    return json(400, { ok: false, reason: 'invalid_json' });
  }
  const { legId, kind } = payload;
  if (!legId || (kind !== 'claimed' && kind !== 'released')) {
    return json(400, { ok: false, reason: 'invalid_payload' });
  }

  const supabaseAsCaller = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const { data: callerUser, error: callerErr } = await supabaseAsCaller.auth.getUser();
  if (callerErr || !callerUser?.user) {
    return json(401, { ok: false, reason: 'auth_invalid' });
  }
  const callerAuthId = callerUser.user.id;

  // Resolve caller's parent row to gate access + find the driver display name.
  const { data: callerParent, error: callerParentErr } = await supabaseAdmin
    .from('parents')
    .select('id, name')
    .eq('auth_user_id', callerAuthId)
    .maybeSingle();
  if (callerParentErr || !callerParent) {
    return json(403, { ok: false, reason: 'caller_not_a_parent' });
  }

  // Look up the leg + event so we have the team_id and event metadata.
  const { data: leg, error: legErr } = await supabaseAdmin
    .from('carpool_legs')
    .select('id, event_id, direction, departure_time, status, driver_id')
    .eq('id', legId)
    .maybeSingle();
  if (legErr || !leg) return json(404, { ok: false, reason: 'leg_not_found' });

  const { data: event, error: eventErr } = await supabaseAdmin
    .from('events')
    .select('id, team_id, title, start_at')
    .eq('id', leg.event_id)
    .maybeSingle();
  if (eventErr || !event?.team_id) {
    return json(404, { ok: false, reason: 'event_not_found' });
  }

  // Per-team timezone is what we format event times in. Falls back to
  // America/Chicago if the column is missing or null (e.g. on a project
  // that hasn't applied migration 012 yet).
  const { data: team } = await supabaseAdmin
    .from('teams')
    .select('timezone')
    .eq('id', event.team_id)
    .maybeSingle();
  const teamTimezone = team?.timezone || 'America/Chicago';

  // Authorization: caller must belong to the leg's team.
  const { data: callerMembership, error: callerMembershipErr } = await supabaseAdmin
    .from('team_members')
    .select('parent_id')
    .eq('team_id', event.team_id)
    .eq('parent_id', callerParent.id)
    .is('removed_at', null)
    .maybeSingle();
  if (callerMembershipErr || !callerMembership) {
    return json(403, { ok: false, reason: 'caller_not_team_member' });
  }

  // Primary audience: parents whose kids are seated on this leg (skip the
  // caller — they don't email themselves). For `claimed`, also include the
  // parent who most recently had an accepted sub_request on this leg so
  // they still get a message after pulling their kid out (no seat rows left).
  const { data: seats, error: seatsErr } = await supabaseAdmin
    .from('seats')
    .select('child_id')
    .eq('leg_id', leg.id);
  if (seatsErr) return json(500, { ok: false, reason: 'seats_lookup_failed' });

  const seatedChildIds = Array.from(
    new Set((seats || []).map((s) => s.child_id).filter(Boolean)),
  );

  const childIdsByParentId = new Map<string, Set<string>>();

  if (seatedChildIds.length > 0) {
    const { data: parentChildren, error: pcErr } = await supabaseAdmin
      .from('parent_children')
      .select('parent_id, child_id')
      .in('child_id', seatedChildIds);
    if (pcErr) return json(500, { ok: false, reason: 'parent_children_lookup_failed' });

    for (const link of parentChildren || []) {
      if (!link.parent_id || link.parent_id === callerParent.id) continue;
      const set = childIdsByParentId.get(link.parent_id) ?? new Set();
      set.add(link.child_id);
      childIdsByParentId.set(link.parent_id, set);
    }
  }

  if (kind === 'claimed') {
    const { data: latestAccepted, error: srErr } = await supabaseAdmin
      .from('sub_requests')
      .select('requested_by')
      .eq('leg_id', leg.id)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!srErr && latestAccepted?.requested_by && latestAccepted.requested_by !== callerParent.id) {
      const rb = latestAccepted.requested_by;
      if (!childIdsByParentId.has(rb)) {
        childIdsByParentId.set(rb, new Set());
      }
    }
  }

  if (childIdsByParentId.size === 0) {
    return json(200, {
      ok: true,
      sent: 0,
      reason: seatedChildIds.length === 0 ? 'no_seated_kids' : 'no_recipients_for_seated_kids',
    });
  }

  // Pull child + parent metadata in parallel so we can name kids in the
  // email body and resolve recipient emails.
  const recipientParentIds = Array.from(childIdsByParentId.keys());
  const [{ data: recipientParents }, childrenResult] = await Promise.all([
    supabaseAdmin
      .from('parents')
      .select('id, auth_user_id, name')
      .in('id', recipientParentIds),
    seatedChildIds.length > 0
      ? supabaseAdmin.from('children').select('id, name').in('id', seatedChildIds)
      : Promise.resolve({ data: [] as { id: string; name: string | null }[], error: null }),
  ]);
  if (childrenResult.error) {
    return json(500, { ok: false, reason: 'children_lookup_failed' });
  }
  const allChildren = childrenResult.data;

  const childNamesById = new Map<string, string>();
  for (const c of allChildren || []) {
    childNamesById.set(c.id, c.name || 'your kid');
  }
  const allKidNames = seatedChildIds
    .map((id) => childNamesById.get(id))
    .filter((name): name is string => Boolean(name));

  const eventTime = fmtTime(event.start_at, teamTimezone);
  const appUrl = 'https://cursor-sdlc-workshop-eight.vercel.app';

  let sent = 0;
  const failures: Array<{ recipient: string; reason: string }> = [];

  for (const parent of recipientParents || []) {
    if (!parent.auth_user_id) continue;

    const recipientChildIds = childIdsByParentId.get(parent.id);
    if (!recipientChildIds) continue;
    if (recipientChildIds.size === 0 && kind !== 'claimed') continue;

    const recipientKidNames = Array.from(recipientChildIds)
      .map((id) => childNamesById.get(id))
      .filter((name): name is string => Boolean(name));

    const { data: userRecord, error: userErr } = await supabaseAdmin.auth.admin.getUserById(
      parent.auth_user_id,
    );
    if (userErr || !userRecord?.user?.email) continue;

    const subject = buildSubject(kind, callerParent.name, event.title);
    const { html, text } = buildBody({
      kind,
      driverName: callerParent.name,
      eventTitle: event.title,
      eventTime,
      direction: leg.direction,
      recipientKidNames,
      allKidNames,
      appUrl,
    });

    const result = await sendEmail({
      to: userRecord.user.email,
      subject,
      html,
      text,
    });

    if (result.ok) {
      sent += 1;
    } else {
      failures.push({ recipient: userRecord.user.email, reason: result.reason || 'unknown' });
    }
  }

  return json(200, {
    ok: true,
    sent,
    failures,
    team_id: event.team_id,
    leg_id: leg.id,
    kind,
  });
});
