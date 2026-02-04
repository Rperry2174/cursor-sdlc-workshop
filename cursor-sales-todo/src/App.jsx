import { useState, useEffect, useRef } from 'react'
import { loadTodos, saveTodos, getDefaultTodos, STATUS } from './initialTodos.js'
import './App.css'

const COLUMNS = [
  { key: STATUS.NOT_STARTED, label: 'Not Started' },
  { key: STATUS.IN_PROGRESS, label: 'In Progress' },
  { key: STATUS.COMPLETED, label: 'Completed' },
]

function App() {
  const [todos, setTodos] = useState(() => loadTodos() ?? getDefaultTodos())
  const [input, setInput] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingValue, setEditingValue] = useState('')
  const editInputRef = useRef(null)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingId])

  function addTodo() {
    const trimmed = input.trim()
    if (!trimmed) return
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: trimmed, status: STATUS.NOT_STARTED },
    ])
    setInput('')
  }

  function setStatus(id, status) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    )
  }

  function removeTodo(id) {
    if (id === editingId) {
      setEditingId(null)
      setEditingValue('')
    }
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  function startEdit(todo) {
    setEditingId(todo.id)
    setEditingValue(todo.text)
  }

  function commitEdit() {
    const val = editingValue.trim()
    if (val) {
      setTodos((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, text: val } : t))
      )
    }
    setEditingId(null)
    setEditingValue('')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingValue('')
  }

  const byStatus = (status) => todos.filter((t) => t.status === status)
  const idx = (key) => COLUMNS.findIndex((c) => c.key === key)

  return (
    <div className="app">
      <header className="header">
        <h1>First month @ Cursor</h1>
        <p className="subtitle">Action items to own your ramp</p>
      </header>

      <section className="add-section">
        <input
          type="text"
          className="input"
          placeholder="Add an action item…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          aria-label="New action item"
        />
        <button type="button" className="btn-add" onClick={addTodo}>
          Add
        </button>
      </section>

      <div className="board">
        {COLUMNS.map((col) => {
          const items = byStatus(col.key)
          const i = idx(col.key)
          const canLeft = i > 0 ? COLUMNS[i - 1].key : null
          const canRight = i < COLUMNS.length - 1 ? COLUMNS[i + 1].key : null
          return (
            <div key={col.key} className={`column column-${col.key}`}>
              <h2 className="column-title">{col.label}</h2>
              <ul className="list" aria-label={col.label}>
                {items.map((todo) => (
                  <li key={todo.id} className="item">
                    {editingId === todo.id ? (
                      <input
                        ref={editInputRef}
                        type="text"
                        className="item-edit"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            commitEdit()
                          }
                          if (e.key === 'Escape') {
                            e.preventDefault()
                            cancelEdit()
                          }
                        }}
                        aria-label="Edit action item"
                      />
                    ) : (
                      <span
                        className="item-text"
                        onDoubleClick={() => startEdit(todo)}
                        title="Double-click to edit"
                      >
                        {todo.text}
                      </span>
                    )}
                    <div className="item-actions">
                      {canLeft && (
                        <button
                          type="button"
                          className="btn-move"
                          onClick={() => setStatus(todo.id, canLeft)}
                          aria-label={`Move "${todo.text}" to ${COLUMNS[i - 1].label}`}
                          title={`Move to ${COLUMNS[i - 1].label}`}
                        >
                          ←
                        </button>
                      }
                      {canRight && (
                        <button
                          type="button"
                          className="btn-move"
                          onClick={() => setStatus(todo.id, canRight)}
                          aria-label={`Move "${todo.text}" to ${COLUMNS[i + 1].label}`}
                          title={`Move to ${COLUMNS[i + 1].label}`}
                        >
                          →
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeTodo(todo.id)}
                        aria-label={`Remove "${todo.text}"`}
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {todos.length === 0 && (
        <p className="empty">No action items yet. Add one above.</p>
      )}
    </div>
  )
}

export default App
