import { useState } from 'react'
import { matchups, teamInfo } from './data/matchups'
import TeamHero from './components/TeamHero'
import BattingLeaders from './components/BattingLeaders'
import MatchupCard from './components/MatchupCard'
import PicksSummary from './components/PicksSummary'
import './App.css'

function App() {
  const [picks, setPicks] = useState({})

  const handlePick = (gameId, team) => {
    setPicks(prev => ({
      ...prev,
      [gameId]: prev[gameId] === team ? null : team,
    }))
  }

  return (
    <div className="app">
      <TeamHero team={teamInfo} />
      <BattingLeaders leaders={teamInfo.battingLeaders} />

      <h2 className="section-title">Upcoming Matchups</h2>

      <div className="cards-grid">
        {matchups.map(game => (
          <MatchupCard
            key={game.id}
            game={game}
            pick={picks[game.id] || null}
            onPick={handlePick}
          />
        ))}
      </div>

      <PicksSummary picks={picks} matchups={matchups} />

      <footer className="app-footer">
        Data as of Apr 14, 2026 &middot; Go Halos!
      </footer>
    </div>
  )
}

export default App
