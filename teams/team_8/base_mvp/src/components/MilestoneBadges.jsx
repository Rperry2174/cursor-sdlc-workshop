import { getMilestones } from '../data/trialContacts';
import './MilestoneBadges.css';

export default function MilestoneBadges({ startDate }) {
  const { week1, week2, week3 } = getMilestones(startDate);

  return (
    <div className="milestone-badges">
      <span className={`badge ${week1 ? 'badge--reached' : 'badge--pending'}`}>
        1w {week1 ? '✓' : '—'}
      </span>
      <span className={`badge ${week2 ? 'badge--reached' : 'badge--pending'}`}>
        2w {week2 ? '✓' : '—'}
      </span>
      <span className={`badge ${week3 ? 'badge--reached' : 'badge--pending'}`}>
        3w {week3 ? '✓' : '—'}
      </span>
    </div>
  );
}
