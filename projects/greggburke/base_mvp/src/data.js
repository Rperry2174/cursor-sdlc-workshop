const PRICING = {
  Riverfront: { daily: 55, weekend: 65, holiday: 75 },
  'Four Season': { daily: 45, weekend: 55, holiday: 65 },
};

function generateSpots() {
  const spots = [];

  for (let i = 1; i <= 62; i++) {
    spots.push({
      id: i,
      number: i,
      type: 'Riverfront',
      status: 'available',
      pricing: PRICING.Riverfront,
    });
  }

  for (let i = 63; i <= 107; i++) {
    spots.push({
      id: i,
      number: i,
      type: 'Four Season',
      status: 'available',
      pricing: PRICING['Four Season'],
    });
  }

  return spots;
}

export const spots = generateSpots();
export { PRICING };

export function isWeekend(date) {
  const day = date.getDay();
  return day === 4 || day === 5 || day === 6;
}

export function calculateTotal(checkIn, checkOut, pricing) {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  let total = 0;
  const current = new Date(start);

  while (current < end) {
    total += isWeekend(current) ? pricing.weekend : pricing.daily;
    current.setDate(current.getDate() + 1);
  }

  return total;
}

export function getNightCount(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(checkOut) - new Date(checkIn);
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}
