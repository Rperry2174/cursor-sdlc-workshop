const BASE = ''

const CONNECTION_ERROR_MESSAGE =
  'Cannot connect to the server. Start the backend with: cd backend && uvicorn app.main:app --reload --port 8000. Then use the app at http://localhost:5173 (npm run dev).'

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
  } catch (e) {
    const msg = (e instanceof Error ? e.message : String(e)).toLowerCase()
    const isConnectionError =
      msg.includes('failed to fetch') ||
      msg.includes('load failed') ||
      msg.includes('networkerror') ||
      msg.includes('connection refused') ||
      msg.includes('err_connection') ||
      msg.includes('network request failed')
    if (isConnectionError) {
      throw new Error(CONNECTION_ERROR_MESSAGE)
    }
    throw e
  }
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json() as Promise<T>
}

export type TranslateDirection = 'la_en' | 'en_la'

export const api = {
  health: () => fetchApi<{ status: string }>('/health'),
  listItems: () => fetchApi<{ items: unknown[] }>('/api/items'),
  translate: (text: string, direction: TranslateDirection) =>
    fetchApi<{ translated_text: string }>('/api/translate', {
      method: 'POST',
      body: JSON.stringify({ text, direction }),
    }),
}
