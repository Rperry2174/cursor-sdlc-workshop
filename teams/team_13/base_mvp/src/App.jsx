import { useState } from 'react'
import { TEAMS } from './data/teams.js'
import TeamPicker from './components/TeamPicker.jsx'
import './App.css'

export default function App() {
  // First team is selected by default
  const [selectedTeam, setSelectedTeam] = useState(TEAMS[0])

  return (
    <div className="app">
      <h1 className="title">World Cup Prediction</h1>
      <p className="subtitle">Pick your favorite team and see their chance of winning.</p>

      <TeamPicker selectedTeam={selectedTeam} onSelectTeam={setSelectedTeam} />

      <div className="result">
        <span className="result-value">{selectedTeam.winPercent}%</span>
        <span className="result-label">
          {selectedTeam.name}'s chance of winning the World Cup
        </span>
      </div>
    </div>
  )
}
