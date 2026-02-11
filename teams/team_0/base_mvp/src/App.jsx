import { useState } from 'react'
import StressTestForm from './components/StressTestForm'
import StressTestReport from './components/StressTestReport'
import './App.css'

const initialData = {
  name: '',
  description: '',
  tam: '',
  sam: '',
  som: '',
  risks: ['', '', '', '', ''],
  marketPotential: '',
  barriersToEntry: '',
  competitors: '',
  differentiation: '',
  traction: '',
  scores: {
    tam: 3,
    risks: 3,
    marketPotential: 3,
    barriersToEntry: 3,
    competitiveLandscape: 3,
    overall: 3,
  },
  verdict: '',
}

function App() {
  const [formData, setFormData] = useState(initialData)
  const [reportData, setReportData] = useState(null)

  const handleGenerateReport = () => {
    setReportData({ ...formData })
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Startup Stress Tester</h1>
        <p>Assess feasibility and potential of your startup idea.</p>
      </header>
      <div className="app-layout">
        <aside className="form-panel">
          <StressTestForm
            data={formData}
            onChange={setFormData}
            onGenerateReport={handleGenerateReport}
          />
        </aside>
        <main className="report-panel">
          <StressTestReport data={reportData} />
        </main>
      </div>
    </div>
  )
}

export default App
