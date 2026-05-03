/**
 * Minimal ICS (RFC 5545) parser focused on what we need to import a
 * GameChanger / Apple Calendar / Google Calendar / TeamSnap feed:
 *
 *   - VEVENT blocks with UID, SUMMARY, DTSTART, DTEND, LOCATION,
 *     DESCRIPTION, STATUS, RRULE
 *   - Line unfolding (lines starting with whitespace continue the
 *     previous line)
 *   - DATE-TIME values in floating, UTC ('Z'), and TZID-prefixed
 *     forms (we treat TZID as local — good enough for prototype)
 *   - Simple weekly RRULE expansion (FREQ=WEEKLY with BYDAY +
 *     COUNT or UNTIL) within a configurable horizon
 *
 * Anything we can't parse is dropped silently and reported in the
 * `skipped` array of the result so the UI can show diagnostics.
 */

const DAY_TO_INDEX = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };

export function parseIcs(text, { horizonDays = 120 } = {}) {
  if (!text || typeof text !== 'string') {
    return { events: [], skipped: ['Empty calendar feed'], calendar: null };
  }

  const lines = unfoldLines(text);
  const calendar = readCalendarHeader(lines);

  const skipped = [];
  const events = [];
  const horizonMs = Date.now() + horizonDays * 24 * 60 * 60 * 1000;

  let inEvent = false;
  let current = null;

  for (const raw of lines) {
    if (raw === 'BEGIN:VEVENT') {
      inEvent = true;
      current = {};
      continue;
    }
    if (raw === 'END:VEVENT') {
      inEvent = false;
      try {
        const expanded = expandEvent(current, horizonMs);
        events.push(...expanded);
      } catch (e) {
        skipped.push(`${current?.SUMMARY || '(unnamed)'}: ${e.message}`);
      }
      current = null;
      continue;
    }
    if (!inEvent) continue;

    const { key, params, value } = splitLine(raw);
    if (!key) continue;
    current[key] = { params, value };
    if (key === 'SUMMARY') current.SUMMARY = value;
  }

  events.sort((a, b) => a.start.localeCompare(b.start));
  return { events, skipped, calendar };
}

function unfoldLines(text) {
  const raw = text.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  for (const line of raw) {
    if (line.startsWith(' ') || line.startsWith('\t')) {
      if (out.length === 0) continue;
      out[out.length - 1] += line.slice(1);
    } else if (line.length > 0) {
      out.push(line);
    }
  }
  return out;
}

function readCalendarHeader(lines) {
  const out = {};
  for (const line of lines) {
    if (line.startsWith('X-WR-CALNAME:')) out.name = line.slice('X-WR-CALNAME:'.length);
    else if (line.startsWith('X-WR-CALDESC:'))
      out.description = line.slice('X-WR-CALDESC:'.length);
    else if (line === 'BEGIN:VEVENT') break;
  }
  return Object.keys(out).length ? out : null;
}

function splitLine(line) {
  const colonIdx = line.indexOf(':');
  if (colonIdx === -1) return {};
  const left = line.slice(0, colonIdx);
  const value = line.slice(colonIdx + 1);
  const semiIdx = left.indexOf(';');
  if (semiIdx === -1) {
    return { key: left.toUpperCase(), params: {}, value };
  }
  const key = left.slice(0, semiIdx).toUpperCase();
  const paramsStr = left.slice(semiIdx + 1);
  const params = {};
  for (const pair of paramsStr.split(';')) {
    const eq = pair.indexOf('=');
    if (eq > -1) params[pair.slice(0, eq).toUpperCase()] = pair.slice(eq + 1);
  }
  return { key, params, value };
}

function parseDateTime(field) {
  if (!field) return null;
  const v = field.value;
  if (!v) return null;
  const m = v.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z?))?$/);
  if (!m) return null;
  const [, y, mo, d, h = '00', mi = '00', s = '00', z] = m;
  if (z === 'Z') {
    return new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)).toISOString();
  }
  return new Date(+y, +mo - 1, +d, +h, +mi, +s).toISOString();
}

function expandEvent(raw, horizonMs) {
  if (!raw || !raw.SUMMARY || !raw.DTSTART) {
    throw new Error('missing required fields');
  }
  const status = raw.STATUS?.value;
  const cancelled = status === 'CANCELLED';
  const start = parseDateTime(raw.DTSTART);
  if (!start) throw new Error('unparseable DTSTART');
  let end = parseDateTime(raw.DTEND);
  if (!end) {
    end = new Date(new Date(start).getTime() + 60 * 60 * 1000).toISOString();
  }
  const baseUid = raw.UID?.value || `${raw.SUMMARY}@${start}`;

  const base = {
    uid: baseUid,
    title: raw.SUMMARY,
    location: raw.LOCATION?.value || '',
    description: raw.DESCRIPTION?.value || '',
    start,
    end,
    cancelled,
  };

  if (!raw.RRULE) return [base];

  const rule = parseRRule(raw.RRULE.value);
  if (rule.freq !== 'WEEKLY') return [base];

  const out = [];
  const startDt = new Date(start);
  const endDt = new Date(end);
  const duration = endDt.getTime() - startDt.getTime();
  const interval = rule.interval || 1;
  const byDayIdx = (rule.byDay || []).map((d) => DAY_TO_INDEX[d]).filter((i) => i !== undefined);
  const limitCount = rule.count || 200;
  const until = rule.until ? new Date(rule.until).getTime() : horizonMs;

  let weekStart = new Date(startDt);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  let occurrences = 0;
  let weeks = 0;

  while (occurrences < limitCount && weeks < 200) {
    for (const dayIdx of byDayIdx.length ? byDayIdx : [startDt.getDay()]) {
      const occStart = new Date(weekStart);
      occStart.setDate(weekStart.getDate() + dayIdx);
      occStart.setHours(
        startDt.getHours(),
        startDt.getMinutes(),
        startDt.getSeconds(),
        0,
      );
      if (occStart < startDt) continue;
      if (occStart.getTime() > until) break;
      out.push({
        ...base,
        uid: `${baseUid}::${occStart.toISOString()}`,
        start: occStart.toISOString(),
        end: new Date(occStart.getTime() + duration).toISOString(),
        recurring_uid: baseUid,
      });
      occurrences++;
      if (occurrences >= limitCount) break;
    }
    weeks++;
    weekStart = new Date(weekStart.getTime() + interval * 7 * 24 * 60 * 60 * 1000);
    if (weekStart.getTime() > until) break;
  }

  return out.length ? out : [base];
}

function parseRRule(value) {
  const out = {};
  for (const part of value.split(';')) {
    const [k, v] = part.split('=');
    if (!k || !v) continue;
    if (k === 'FREQ') out.freq = v.toUpperCase();
    else if (k === 'INTERVAL') out.interval = parseInt(v, 10);
    else if (k === 'COUNT') out.count = parseInt(v, 10);
    else if (k === 'UNTIL') {
      const d = parseDateTime({ value: v });
      out.until = d;
    } else if (k === 'BYDAY') out.byDay = v.split(',').map((d) => d.toUpperCase());
  }
  return out;
}
