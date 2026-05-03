/**
 * Ordered stop addresses for map deep links and (server-side) routing.
 * Mirrors ActiveRide / Today stop semantics: drop-off = homes then venue;
 * pick-up = venue then homes then driver home.
 */

import { db, getKidsInLeg, getCoParentsForChild, getParent } from '../data/store.js';

/**
 * @param {object} leg
 * @param {object} event
 * @param {object|null} driver parent row (with home_address)
 * @param {object[]} seatedKids child rows on this leg (id, name, …)
 * @param {Array<{parent_id: string, child_id: string}>} parentChildrenLinks
 * @param {Map<string, object>|Record<string, object>} parentsById parent id -> row with home_address
 * @returns {string[]}
 */
export function buildOrderedMapAddresses({
  leg,
  event,
  driver,
  seatedKids,
  parentChildrenLinks = [],
  parentsById,
}) {
  const parentMap =
    parentsById instanceof Map ? parentsById : new Map(Object.entries(parentsById || {}));

  const driverId = driver?.id || leg.driver_id;
  const driverHome = (driver && driver.home_address) || leg.departure_location || '';
  const eventVenue = (event && event.location) || leg.arrival_location || leg.departure_location || '';

  const pickupHomesOrdered = [];
  const seenParent = new Set();
  for (const kid of seatedKids || []) {
    const links = (parentChildrenLinks || []).filter((pc) => pc.child_id === kid.id);
    for (const link of links) {
      if (!link.parent_id || link.parent_id === driverId) continue;
      if (seenParent.has(link.parent_id)) continue;
      seenParent.add(link.parent_id);
      const p = parentMap.get(link.parent_id);
      const addr = (p && p.home_address) || '';
      if (addr) pickupHomesOrdered.push(addr);
    }
  }

  if (leg.direction === 'to_event') {
    const start = driverHome || leg.departure_location || '';
    const end = eventVenue || leg.arrival_location || '';
    const mid = pickupHomesOrdered;
    return [start, ...mid, end].filter(Boolean);
  }

  // from_event: leave venue, drop kids at homes, end at driver home
  const start = eventVenue || leg.departure_location || '';
  const end = driverHome || leg.arrival_location || '';
  return [start, ...pickupHomesOrdered, end].filter(Boolean);
}

/**
 * Local prototype DB path (demo data).
 * @param {object} leg
 * @param {object} event
 * @returns {string[]}
 */
export function buildOrderedMapAddressesLocal(leg, event) {
  const data = db();
  const driver = leg.driver_id ? getParent(leg.driver_id) : null;
  const kids = getKidsInLeg(leg.id);
  const seatedKids = kids;
  const parentChildrenLinks = [];
  for (const kid of kids) {
    const cos = getCoParentsForChild(kid.id);
    for (const p of cos) {
      parentChildrenLinks.push({ parent_id: p.id, child_id: kid.id });
    }
  }
  const parentsById = new Map(data.parents.map((p) => [p.id, p]));
  return buildOrderedMapAddresses({
    leg,
    event,
    driver,
    seatedKids,
    parentChildrenLinks,
    parentsById,
  });
}

/**
 * Backend Today lookups path.
 * @param {object} leg
 * @param {object} event
 * @param {object|null} lookups from buildBackendLookups
 * @returns {string[]}
 */
export function buildOrderedMapAddressesFromLookups(leg, event, lookups) {
  if (!lookups) return buildOrderedMapAddressesLocal(leg, event);
  const driver = leg.driver_id ? lookups.parentsById.get(leg.driver_id) : null;
  const seats = lookups.seatsByLegId.get(leg.id) || [];
  const seatedKids = seats
    .map((s) => lookups.childrenById.get(s.child_id))
    .filter(Boolean);
  const parentChildrenLinks = (lookups.parentChildren || []).filter((pc) =>
    seats.some((s) => s.child_id === pc.child_id),
  );
  return buildOrderedMapAddresses({
    leg,
    event,
    driver,
    seatedKids,
    parentChildrenLinks,
    parentsById: lookups.parentsById,
  });
}

/**
 * Backend leg detail payload (loadBackendLegDetail).
 */
export function buildOrderedMapAddressesFromLegDetail(detail) {
  const { leg, event, driver, seatedKids, parentChildrenLinks, relatedParentsById } = detail;
  const parentsById = new Map(Object.entries(relatedParentsById || {}));
  if (driver) parentsById.set(driver.id, { ...parentsById.get(driver.id), ...driver });
  return buildOrderedMapAddresses({
    leg,
    event,
    driver,
    seatedKids: seatedKids || [],
    parentChildrenLinks: parentChildrenLinks || [],
    parentsById,
  });
}

/**
 * Build ActiveRide-style stops from Supabase leg detail (mirrors ActiveRide.jsx `buildStops`).
 */
export function buildActiveRideStopsFromLegDetail(detail) {
  const { leg, event, driver, seatedKids, parentChildrenLinks, relatedParentsById } = detail;
  const parentsById = new Map(Object.entries(relatedParentsById || {}));
  if (driver) parentsById.set(driver.id, { ...parentsById.get(driver.id), ...driver });

  const kids = seatedKids || [];
  const driverId = driver?.id || leg.driver_id;

  const kidStops = kids.map((kid, i) => {
    const links = (parentChildrenLinks || []).filter((pc) => pc.child_id === kid.id);
    let homeAddr = '';
    let parent = null;
    for (const link of links) {
      if (link.parent_id === driverId) continue;
      const p = parentsById.get(link.parent_id);
      if (p?.home_address) {
        homeAddr = p.home_address;
        parent = p;
        break;
      }
    }
    return {
      kind: leg.direction === 'to_event' ? 'pickup' : 'dropoff',
      id: `kid_${kid.id}`,
      kid,
      parent,
      address: homeAddr,
      lat: undefined,
      lng: undefined,
      orderHint: i,
    };
  });

  const venueAddr = (event && event.location) || leg.arrival_location || '';
  const eventStop = {
    kind: 'destination',
    id: 'destination',
    label: event?.title || 'Event',
    address: venueAddr,
    lat: undefined,
    lng: undefined,
  };

  if (leg.direction === 'to_event') {
    return [...kidStops, eventStop];
  }
  const startAddr = (event && event.location) || leg.departure_location || '';
  return [
    {
      kind: 'event_pickup',
      id: 'event_pickup',
      label: event?.title || 'Event',
      address: startAddr,
      lat: undefined,
      lng: undefined,
    },
    ...kidStops,
  ];
}
