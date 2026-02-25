/**
 * Synthetic trial contacts at different stages to demonstrate the tracker.
 * Start dates are set so that relative to "today" we get a spread:
 * - No milestones yet (early trial)
 * - 1 week reached
 * - 2 weeks reached
 * - 3 weeks reached
 */
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysAgo(days) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return new Date(d.getTime() - days * MS_PER_DAY).toISOString().slice(0, 10);
}

export const INITIAL_TRIAL_CONTACTS = [
  {
    id: '1',
    name: 'Alex Chen',
    startDate: daysAgo(3),
    owner: 'Jordan',
  },
  {
    id: '2',
    name: 'Sam Rivera',
    startDate: daysAgo(7),
    owner: 'Casey',
  },
  {
    id: '3',
    name: 'Morgan Lee',
    startDate: daysAgo(14),
    owner: 'Jordan',
  },
  {
    id: '4',
    name: 'Riley Kim',
    startDate: daysAgo(21),
    owner: 'Casey',
  },
  {
    id: '5',
    name: 'Jordan Taylor',
    startDate: daysAgo(5),
    owner: 'Alex',
  },
];

/**
 * Returns days since start date (based on today).
 */
export function getDaysInTrial(startDateStr) {
  const start = new Date(startDateStr);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today - start) / MS_PER_DAY);
}

/**
 * Returns { week1: bool, week2: bool, week3: bool } for the given start date.
 */
export function getMilestones(startDateStr) {
  const days = getDaysInTrial(startDateStr);
  return {
    week1: days >= 7,
    week2: days >= 14,
    week3: days >= 21,
  };
}
