/**
 * Seed data for the Carpool prototype.
 *
 * One demo team (Tigers Baseball, Spring 2026), 4 parent families,
 * 6 kids, and ~14 days of mixed practice + game events with carpool
 * legs in varied states (open / claimed-by-you / claimed-by-other).
 */

function isoOffset(daysOffset, hour, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function seed() {
  const parents = [
    { id: 'p_sarah', name: 'Sarah Chen', phone: '+15555550101', avatar_color: 'green', default_seats: 4, home_address: '124 Maple St', school_address: 'Lincoln Elementary' },
    { id: 'p_mike', name: 'Mike Rivera', phone: '+15555550102', avatar_color: 'blue', default_seats: 5, home_address: '88 Oak Ave', school_address: 'Lincoln Elementary' },
    { id: 'p_priya', name: 'Priya Patel', phone: '+15555550103', avatar_color: 'purple', default_seats: 4, home_address: '56 Elm St', school_address: 'Lincoln Elementary' },
    { id: 'p_alex', name: 'Alex Johnson', phone: '+15555550104', avatar_color: 'orange', default_seats: 6, home_address: '12 Pine Dr', school_address: 'Lincoln Elementary' },
  ];

  const children = [
    { id: 'c_lucas', name: 'Lucas', age: 9, avatar_color: 'green', school: 'Lincoln Elementary', position: 'Pitcher' },
    { id: 'c_mia', name: 'Mia', age: 7, avatar_color: 'pink', school: 'Lincoln Elementary', position: '2B' },
    { id: 'c_diego', name: 'Diego', age: 10, avatar_color: 'blue', school: 'Lincoln Elementary', position: 'C' },
    { id: 'c_aanya', name: 'Aanya', age: 9, avatar_color: 'teal', school: 'Lincoln Elementary', position: 'SS' },
    { id: 'c_jordan', name: 'Jordan', age: 8, avatar_color: 'orange', school: 'Lincoln Elementary', position: 'OF' },
    { id: 'c_riley', name: 'Riley', age: 9, avatar_color: 'purple', school: 'Lincoln Elementary', position: 'OF' },
  ];

  const parent_children = [
    { parent_id: 'p_sarah', child_id: 'c_lucas' },
    { parent_id: 'p_sarah', child_id: 'c_mia' },
    { parent_id: 'p_mike', child_id: 'c_diego' },
    { parent_id: 'p_priya', child_id: 'c_aanya' },
    { parent_id: 'p_priya', child_id: 'c_riley' },
    { parent_id: 'p_alex', child_id: 'c_jordan' },
  ];

  const teams = [
    {
      id: 't_tigers',
      name: 'Tigers Baseball',
      sport: 'Baseball',
      age_group: 'U10',
      season: 'Spring 2026',
      invite_code: 'TIGERS-9421',
      plan: 'free',
      stripe_customer_id: null,
    },
  ];

  const team_members = [
    { team_id: 't_tigers', parent_id: 'p_sarah', role: 'admin', driver_approved: true },
    { team_id: 't_tigers', parent_id: 'p_mike', role: 'member', driver_approved: true },
    { team_id: 't_tigers', parent_id: 'p_priya', role: 'member', driver_approved: true },
    { team_id: 't_tigers', parent_id: 'p_alex', role: 'member', driver_approved: true },
  ];

  const child_teams = [
    { team_id: 't_tigers', child_id: 'c_lucas' },
    { team_id: 't_tigers', child_id: 'c_diego' },
    { team_id: 't_tigers', child_id: 'c_aanya' },
    { team_id: 't_tigers', child_id: 'c_jordan' },
    { team_id: 't_tigers', child_id: 'c_riley' },
  ];

  // Build 14 days of events: practices Mon/Wed/Fri at 5:30pm, games Sat at 10am.
  const events = [];
  const carpool_legs = [];
  const seats = [];

  for (let day = 0; day < 14; day++) {
    const d = new Date();
    d.setDate(d.getDate() + day);
    const dow = d.getDay();
    let kind = null;
    let startHour = null;
    let endHour = null;
    let title = null;
    let location = null;

    if ([1, 3, 5].includes(dow)) {
      kind = 'practice';
      startHour = 17;
      endHour = 19;
      title = 'Tigers practice';
      location = 'Riverside Field, Field 3';
    } else if (dow === 6) {
      kind = 'game';
      startHour = 10;
      endHour = 12;
      title = 'Tigers vs. Wildcats';
      location = 'Memorial Park, Diamond 2';
    } else {
      continue;
    }

    const eventId = `evt_${day}`;
    events.push({
      id: eventId,
      title,
      type: kind,
      start_at: isoOffset(day, startHour, 0),
      end_at: isoOffset(day, endHour, 0),
      location,
      team_id: 't_tigers',
      source: 'manual',
      source_uid: null,
      cancelled_at: null,
    });

    // TO leg
    const toLegId = `leg_${day}_to`;
    carpool_legs.push({
      id: toLegId,
      event_id: eventId,
      direction: 'to_event',
      departure_time: isoOffset(day, startHour - 1, 0),
      departure_location: 'Lincoln Elementary',
      arrival_location: location,
      driver_id: null,
      seat_capacity: 4,
      notes: '',
      status: 'open',
      claimed_at: null,
    });

    // FROM leg
    const fromLegId = `leg_${day}_from`;
    carpool_legs.push({
      id: fromLegId,
      event_id: eventId,
      direction: 'from_event',
      departure_time: isoOffset(day, endHour, 5),
      departure_location: location,
      arrival_location: 'Home',
      driver_id: null,
      seat_capacity: 4,
      notes: '',
      status: 'open',
      claimed_at: null,
    });
  }

  // Pre-fill some assignments to make the demo realistic.
  // Day 0 (today): both legs claimed, kids seated.
  // Day 1: one leg claimed by you, one open.
  // Day 2: nothing claimed (urgent demo).
  // Days 3-7: rotated.
  function claim(legId, parentId, capacity = 4) {
    const leg = carpool_legs.find((l) => l.id === legId);
    if (leg) {
      leg.driver_id = parentId;
      leg.seat_capacity = capacity;
      leg.status = 'filled';
      leg.claimed_at = new Date(Date.now() - Math.random() * 7 * 86400000).toISOString();
    }
  }
  function seat(legId, childId, addedBy) {
    seats.push({
      id: `seat_${legId}_${childId}`,
      leg_id: legId,
      child_id: childId,
      added_by: addedBy,
      created_at: new Date().toISOString(),
    });
  }

  // Day 0: Sarah drives drop-off, Mike drives pick-up
  if (carpool_legs.find((l) => l.id === 'leg_0_to')) {
    claim('leg_0_to', 'p_sarah', 4);
    seat('leg_0_to', 'c_lucas', 'p_sarah');
    seat('leg_0_to', 'c_diego', 'p_mike');
    seat('leg_0_to', 'c_aanya', 'p_priya');
    claim('leg_0_from', 'p_mike', 5);
    seat('leg_0_from', 'c_lucas', 'p_sarah');
    seat('leg_0_from', 'c_diego', 'p_mike');
    seat('leg_0_from', 'c_aanya', 'p_priya');
    seat('leg_0_from', 'c_jordan', 'p_alex');
  }

  // Day 1: Priya drives drop-off, FROM is open
  if (carpool_legs.find((l) => l.id === 'leg_1_to')) {
    claim('leg_1_to', 'p_priya', 4);
    seat('leg_1_to', 'c_aanya', 'p_priya');
    seat('leg_1_to', 'c_riley', 'p_priya');
    seat('leg_1_to', 'c_lucas', 'p_sarah');
  }

  // Day 3: Sarah drives drop-off (her turn highlighted)
  if (carpool_legs.find((l) => l.id === 'leg_3_to')) {
    claim('leg_3_to', 'p_sarah', 4);
    seat('leg_3_to', 'c_lucas', 'p_sarah');
    seat('leg_3_to', 'c_diego', 'p_mike');
    claim('leg_3_from', 'p_alex', 6);
    seat('leg_3_from', 'c_lucas', 'p_sarah');
    seat('leg_3_from', 'c_jordan', 'p_alex');
  }

  // Day 5: full carpool both ways
  if (carpool_legs.find((l) => l.id === 'leg_5_to')) {
    claim('leg_5_to', 'p_alex', 6);
    seat('leg_5_to', 'c_jordan', 'p_alex');
    seat('leg_5_to', 'c_lucas', 'p_sarah');
    seat('leg_5_to', 'c_aanya', 'p_priya');
    claim('leg_5_from', 'p_sarah', 4);
    seat('leg_5_from', 'c_lucas', 'p_sarah');
    seat('leg_5_from', 'c_aanya', 'p_priya');
  }

  // Honor Mike's "every Wednesday drop-off" recurring commitment in the demo data.
  for (let d = 0; d < 14; d++) {
    const dt = new Date();
    dt.setDate(dt.getDate() + d);
    if (dt.getDay() !== 3) continue;
    const leg = carpool_legs.find((l) => l.id === `leg_${d}_to`);
    if (leg && !leg.driver_id) {
      claim(`leg_${d}_to`, 'p_mike', 5);
      seat(`leg_${d}_to`, 'c_diego', 'p_mike');
    }
  }

  // Day 6 (Saturday game): Mike drop-off, Sarah pick-up
  if (carpool_legs.find((l) => l.id === 'leg_6_to')) {
    claim('leg_6_to', 'p_mike', 5);
    seat('leg_6_to', 'c_diego', 'p_mike');
    seat('leg_6_to', 'c_lucas', 'p_sarah');
    seat('leg_6_to', 'c_jordan', 'p_alex');
    claim('leg_6_from', 'p_sarah', 4);
    seat('leg_6_from', 'c_lucas', 'p_sarah');
    seat('leg_6_from', 'c_diego', 'p_mike');
  }

  const ride_status_events = [];
  const sub_requests = [];
  const sub_request_responses = [];

  // Recurring driving commitments — Mike drives every Wednesday drop-off.
  const recurring_commitments = [
    {
      id: 'rc_mike_wed_to',
      parent_id: 'p_mike',
      team_id: 't_tigers',
      day_of_week: 3,
      direction: 'to_event',
      seat_capacity: 5,
      starts_on: isoOffset(-7, 0).slice(0, 10),
      ends_on: isoOffset(60, 0).slice(0, 10),
      paused: false,
      created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
  ];

  // Blackout dates — none seeded by default.
  const blackout_dates = [];

  // Group chat — a couple of starter messages so the screen feels alive.
  const chat_messages = [
    {
      id: 'msg_1',
      team_id: 't_tigers',
      author_id: 'p_priya',
      kind: 'text',
      body: 'Heads up, Aanya might have a runny nose tomorrow but plans to play.',
      pinned_event_id: null,
      created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    },
    {
      id: 'msg_2',
      team_id: 't_tigers',
      author_id: 'p_alex',
      kind: 'text',
      body: 'Thanks for the pickup yesterday Sarah! 🙏',
      pinned_event_id: null,
      created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    },
    {
      id: 'msg_3',
      team_id: 't_tigers',
      author_id: 'system',
      kind: 'system_event',
      body: 'Mike claimed Wednesday drop-off (recurring).',
      pinned_event_id: null,
      created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    },
  ];

  // Default notification preferences for everyone (Balanced preset).
  const notification_preferences = parents.map((p) => ({
    parent_id: p.id,
    style: 'balanced',
    channels: { push: true, sms: false, email: false },
    by_type: {
      driver_claimed: 'silent',
      driver_swapped: 'push',
      driver_released: 'push',
      driver_cancelled_emergency: 'push',
      kid_added: 'push',
      kid_removed: 'push',
      sub_request_open: 'push',
      en_route: 'push',
      kid_picked_up: 'push',
      arrived: 'push',
      kid_dropped_off: 'push',
      running_late: 'push',
      digest_daily: 'push',
      chat_mention: 'push',
      chat_message: 'silent',
    },
    by_team: { t_tigers: 'inherit' },
    quiet_hours: { enabled: true, start: '21:00', end: '07:00' },
    always_alert_my_kid: true,
    snoozed_until: null,
    wizard_completed: false,
  }));

  // A few starter notifications for Sarah
  const notifications = [
    {
      id: 'notif_1',
      recipient_id: 'p_sarah',
      kind: 'sub_request_open',
      body: 'Mike requested a sub for Wed pick-up',
      leg_id: null,
      created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      read_at: null,
    },
    {
      id: 'notif_2',
      recipient_id: 'p_sarah',
      kind: 'kid_added',
      body: 'Priya added Aanya to your Tuesday drop-off',
      leg_id: 'leg_3_to',
      created_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
      read_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    },
  ];

  return {
    parents,
    children,
    parent_children,
    teams,
    team_members,
    child_teams,
    events,
    carpool_legs,
    seats,
    ride_status_events,
    sub_requests,
    sub_request_responses,
    notifications,
    recurring_commitments,
    blackout_dates,
    chat_messages,
    notification_preferences,
    schedule_sources: [],
    auto_claim_rules: [],
    app_config: {
      claim_contention_window_seconds: 5,
      cancellation_window_minutes: 30,
    },
  };
}
