import { useState, useRef } from 'react';
import { DEFAULT_COLUMNS, DEFAULT_AGENTS, UNASSIGNED_COLUMN_ID } from './data';
import KanbanColumn from './components/KanbanColumn';
import AddColumnModal from './components/AddColumnModal';
import AddAgentModal from './components/AddAgentModal';
import './App.css';

export default function App() {
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [agents, setAgents] = useState(DEFAULT_AGENTS);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [showAddAgent, setShowAddAgent] = useState(false);
  // Track which agent is currently being dragged
  const draggingAgentId = useRef(null);

  function handleDragStart(agentId) {
    draggingAgentId.current = agentId;
  }

  function handleDrop(targetColumnId) {
    const agentId = draggingAgentId.current;
    if (!agentId) return;
    draggingAgentId.current = null;
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
    // New agents always land in Unassigned
    setAgents((prev) => [...prev, { ...newAgent, columnId: UNASSIGNED_COLUMN_ID }]);
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
              onDragStart={handleDragStart}
              onDrop={handleDrop}
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
