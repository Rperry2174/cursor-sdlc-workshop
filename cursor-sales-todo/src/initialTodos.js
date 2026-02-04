const DEFAULT_ITEMS = [
  'Complete Cursor onboarding and systems access',
  'Finish Cursor product & value proposition training',
  'Shadow 2–3 discovery or demo calls',
  'Build your first 30-day target account list',
  'Schedule intro meetings with 10 qualified prospects',
  'Send your first outreach sequence (email/LinkedIn)',
  'Log all activity and notes in CRM',
  'Book 1:1 with your manager to align on goals',
  'Join team standups and introduce yourself',
  'Complete first month goals & ramp checklist',
]

export const STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
}

export function getDefaultTodos() {
  return DEFAULT_ITEMS.map((text) => ({
    id: crypto.randomUUID(),
    text,
    status: STATUS.NOT_STARTED,
  }))
}

function migrateItem(item) {
  if (item.status) return item
  if (typeof item.done === 'boolean') {
    return { ...item, status: item.done ? STATUS.COMPLETED : STATUS.NOT_STARTED }
  }
  return { ...item, status: STATUS.NOT_STARTED }
}

const STORAGE_KEY = 'cursor-sales-todo-v2'
const LEGACY_KEY = 'cursor-sales-todo-v1'

export function loadTodos() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) raw = localStorage.getItem(LEGACY_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!Array.isArray(data) || data.length === 0) return null
    return data.map(migrateItem)
  } catch {
    return null
  }
}

export function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch {
    // ignore
  }
}
