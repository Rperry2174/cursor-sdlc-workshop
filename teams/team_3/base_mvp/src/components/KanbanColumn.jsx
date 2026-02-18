import AgentCard from './AgentCard';
import './KanbanColumn.css';

export default function KanbanColumn({ column, agents, allColumns, onMoveAgent }) {
  return (
    <div className="kanban-column">
      <div className="kanban-column__header">
        <h3 className="kanban-column__title">{column.name}</h3>
        <span className="kanban-column__count">{agents.length}</span>
      </div>
      {column.context && (
        <p className="kanban-column__context">{column.context}</p>
      )}
      <div className="kanban-column__cards">
        {agents.length === 0 && (
          <div className="kanban-column__empty">No agents here yet</div>
        )}
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            columns={allColumns}
            onMove={onMoveAgent}
          />
        ))}
      </div>
    </div>
  );
}
