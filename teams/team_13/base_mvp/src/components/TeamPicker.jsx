/**
 * Team picker — lets the user choose their favorite team from the World Cup list.
 * Uses clickable cards in a grid. Selection updates the displayed win % via callback.
 */
import { TEAMS } from '../data/teams.js'
import './TeamPicker.css'

export default function TeamPicker({ selectedTeam, onSelectTeam }) {
  return (
    <div className="team-picker">
      <label className="team-picker-label">Pick your favorite team</label>
      <div className="team-picker-grid">
        {TEAMS.map((team) => (
          <button
            key={team.id}
            type="button"
            className={`team-card ${selectedTeam?.id === team.id ? 'team-card--selected' : ''}`}
            onClick={() => onSelectTeam(team)}
            aria-pressed={selectedTeam?.id === team.id}
            aria-label={`Select ${team.name}`}
          >
            <span className="team-card-name">{team.name}</span>
            <span className="team-card-percent">{team.winPercent}%</span>
          </button>
        ))}
      </div>
    </div>
  )
}
