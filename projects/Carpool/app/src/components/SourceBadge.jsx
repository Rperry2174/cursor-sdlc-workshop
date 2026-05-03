/**
 * Tiny "via GameChanger" / "via Apple Calendar" badge shown on event
 * cards that came from an imported calendar feed. Helps parents trust
 * where the data is coming from. Returns null for manually-created
 * events so the badge doesn't clutter every row.
 *
 * Vendor detection inspects (in order of strength):
 *   1. The source's URL (most reliable — e.g. team-manager.gc.com is
 *      always GameChanger regardless of what the user named the feed)
 *   2. The source kind ("sample" → Sample data)
 *   3. The user-typed source name and event label (fallback)
 */

import { getSource } from '../data/store.js';

function detectVendor({ url = '', kind = '', label = '' } = {}) {
  const u = url.toLowerCase();
  if (u.includes('gc.com') || u.includes('team-manager') || u.includes('gamechanger')) {
    return { name: 'GameChanger', icon: '🟢' };
  }
  if (u.includes('teamsnap')) return { name: 'TeamSnap', icon: '🟦' };
  if (u.includes('sportsengine')) return { name: 'SportsEngine', icon: '🟧' };
  if (u.includes('icloud') || u.includes('apple')) return { name: 'Apple Calendar', icon: '🍎' };
  if (u.includes('google.com') || u.includes('googleusercontent'))
    return { name: 'Google Calendar', icon: '🟦' };

  if (kind === 'sample') return { name: 'Sample data', icon: '🧪' };

  const l = label.toLowerCase();
  if (l.includes('gamechanger') || l.includes('tigers')) return { name: 'GameChanger', icon: '🟢' };
  if (l.includes('teamsnap')) return { name: 'TeamSnap', icon: '🟦' };
  if (l.includes('sportsengine')) return { name: 'SportsEngine', icon: '🟧' };
  if (l.includes('apple') || l.includes('icloud')) return { name: 'Apple Calendar', icon: '🍎' };
  if (l.includes('google')) return { name: 'Google Calendar', icon: '🟦' };
  if (l.includes('sample') || l.includes('demo')) return { name: 'Sample data', icon: '🧪' };

  return { name: 'Calendar feed', icon: '📅' };
}

export function SourceBadge({ event, size = 'sm', style }) {
  if (!event?.source) return null;
  const src = getSource(event.source);
  const vendor = detectVendor({
    url: src?.url || '',
    kind: src?.kind || '',
    label: event.source_label || src?.name || '',
  });
  const compact = size === 'sm';
  return (
    <span
      title={event.source_label || vendor.name}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: 'var(--gray-100)',
        color: 'var(--gray-700)',
        borderRadius: 999,
        padding: compact ? '1px 6px' : '3px 8px',
        fontSize: compact ? 10 : 11,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span style={{ fontSize: compact ? 10 : 12 }}>{vendor.icon}</span>
      <span>via {vendor.name}</span>
    </span>
  );
}
