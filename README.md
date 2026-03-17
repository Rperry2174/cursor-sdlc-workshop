# Via Verborum — Latin Translation

Latin ↔ English translation app: **React** (Vite) frontend and **FastAPI** backend.

## Why Python wasn’t working

1. **Missing dependencies** — `uvicorn` and other backend packages weren’t installed. The system Python doesn’t have them.
2. **No virtual environment** — Running `python3 -m uvicorn ...` used the system interpreter, which had no `uvicorn` module.

**Fix:** Use the project’s backend venv and install deps there. The updated `./start.sh` does this for you: it creates `backend/.venv` if needed and runs `pip install -r requirements.txt` when uvicorn isn’t installed. You can also do it manually (see Backend below).

The backend was also updated for **Python 3.9**: it no longer uses `str | None` (Python 3.10+ only); it uses `Optional[str]` from `typing` so it runs on 3.9.

## Why Latin translation wasn’t working

The backend now uses **local OPUS-MT models** instead of LibreTranslate:

- `Latin → English` uses `Helsinki-NLP/opus-mt-ROMANCE-en`
- `English → Latin` uses `Helsinki-NLP/opus-mt-en-ROMANCE`

The first time you translate, the models will download and cache locally. After that, translation runs offline on your machine.

The app keeps the same `{"translated_text": ...}` API contract, so the frontend does not need to change.

## Structure

- **`frontend/`** – React + TypeScript + Vite
- **`backend/`** – FastAPI (Python 3.9+)

## Setup

**One command (from project root):**

```bash
./start.sh
```

This starts the backend (creating a venv and installing deps if needed) and then the frontend. Open **http://localhost:5173** in your browser. Press Ctrl+C to stop.

**First time:** You need Node.js for the frontend. With Homebrew: `brew install node`. The start script finds npm via Homebrew automatically. If the dev server complains about missing modules, run `npm install` in `frontend/`.

### Backend (manual)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### First translation

The first Latin translation will download the Hugging Face model weights into the local cache. That can take a little while, depending on your network and machine. Later translations reuse the cached models.

### Frontend (manual)

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

The Vite dev server proxies `/api` and `/health` to the backend. If you see “Cannot connect to the server”, start the backend first (e.g. `./start.sh` or the manual backend steps above), then open http://localhost:5173.

## Scripts

| Location   | Command              | Description        |
|-----------|----------------------|--------------------|
| backend   | `uvicorn app.main:app --reload` | Start API server   |
| frontend  | `npm run dev`        | Start dev server   |
| frontend  | `npm run build`      | Production build   |
