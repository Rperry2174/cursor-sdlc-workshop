import { useState } from 'react';
import AgentCard from './AgentCard';
import './KanbanColumn.css';

export default function KanbanColumn({ column, agents, onDragStart, onDrop }) {
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }

  function handleDragLeave(e) {
    // Only clear if leaving the column entirely (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(column.id);
  }

  return (
    <div
      className={`kanban-column ${isDragOver ? 'kanban-column--drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="kanban-column__header">
        <h3 className="kanban-column__title">{column.name}</h3>
        <span className="kanban-column__count">{agents.length}</span>
      </div>
      {column.context && (
        <p className="kanban-column__context">{column.context}</p>
      )}
      <div className="kanban-column__cards">
        {agents.length === 0 && (
          <div className={`kanban-column__empty ${isDragOver ? 'kanban-column__empty--active' : ''}`}>
            Drop agent here
          </div>
        )}
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
}
