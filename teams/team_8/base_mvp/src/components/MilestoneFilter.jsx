import './MilestoneFilter.css';

export const FILTER_ALL = 'all';
export const FILTER_1W = '1w';
export const FILTER_2W = '2w';
export const FILTER_3W = '3w';

export default function MilestoneFilter({ value, onChange }) {
  return (
    <div className="milestone-filter">
      <label htmlFor="milestone-filter" className="filter-label">Show:</label>
      <select
        id="milestone-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="filter-select"
      >
        <option value={FILTER_ALL}>All contacts</option>
        <option value={FILTER_1W}>At 1 week</option>
        <option value={FILTER_2W}>At 2 weeks</option>
        <option value={FILTER_3W}>At 3 weeks</option>
      </select>
    </div>
  );
}
