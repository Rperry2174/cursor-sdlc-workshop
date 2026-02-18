import { useState } from 'react';
import { DEFAULT_COLUMNS, DEFAULT_AGENTS } from './data';
import KanbanColumn from './components/KanbanColumn';
import AddColumnModal from './components/AddColumnModal';
import AddAgentModal from './components/AddAgentModal';
import './App.css';

export default function App() {
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [agents, setAgents] = useState(DEFAULT_AGENTS);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [showAddAgent, setShowAddAgent] = useState(false);

  function handleMoveAgent(agentId, targetColumnId) {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId ? { ...a, columnId: targetColumnId } : a
      )
    );
  }

  function handleAddColumn(newColumn) {
    setColumns((prev) => [...prev, newColumn]);
  }

  function handleAddAgent(newAgent) {
    setAgents((prev) => [...prev, newAgent]);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__left">
          <span className="app-logo">⬡</span>
          <div>
            <h1 className="app-title">AgentBoard</h1>
            <p className="app-subtitle">AI Agent Workflow Manager</p>
          </div>
        </div>
        <div className="app-header__actions">
          <button className="btn btn--secondary" onClick={() => setShowAddAgent(true)}>
            + Add Agent
          </button>
          <button className="btn btn--primary" onClick={() => setShowAddColumn(true)}>
            + Add Column
          </button>
        </div>
      </header>

      <main className="board-wrapper">
        <div className="board">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              agents={agents.filter((a) => a.columnId === col.id)}
              allColumns={columns}
              onMoveAgent={handleMoveAgent}
            />
          ))}
        </div>
      </main>

      {showAddColumn && (
        <AddColumnModal
          onAdd={handleAddColumn}
          onClose={() => setShowAddColumn(false)}
        />
      )}

      {showAddAgent && (
        <AddAgentModal
          columns={columns}
          onAdd={handleAddAgent}
          onClose={() => setShowAddAgent(false)}
        />
      )}
    </div>
  );
}
