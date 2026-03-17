#!/usr/bin/env bash
# Start backend and frontend for Via Verborum. Run from project root: ./start.sh

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

PYTHON=$(command -v python3 || command -v python)
if [ -z "$PYTHON" ]; then
  echo "Python not found. Install Python 3.9+ and try again."
  exit 1
fi

# Prefer Homebrew binaries when available so npm can find node.
for brew_bin in /opt/homebrew/bin /usr/local/bin; do
  if [ -x "$brew_bin/node" ] || [ -x "$brew_bin/npm" ]; then
    export PATH="$brew_bin:$PATH"
    break
  fi
done

# Use backend venv if it exists; otherwise create it and install deps
BACKEND_DIR="$ROOT/backend"
VENV="$BACKEND_DIR/.venv"
if [ ! -d "$VENV" ]; then
  echo "Creating Python venv in backend/.venv ..."
  (cd "$BACKEND_DIR" && $PYTHON -m venv .venv)
fi
VENV_PYTHON="$VENV/bin/python"
if [ ! -f "$VENV_PYTHON" ]; then
  echo "Venv not found at $VENV. Create it with: cd backend && $PYTHON -m venv .venv"
  exit 1
fi

# Ensure uvicorn and deps are installed
if ! "$VENV_PYTHON" -c "import uvicorn" 2>/dev/null; then
  echo "Installing backend dependencies (pip install -r requirements.txt) ..."
  (cd "$BACKEND_DIR" && "$VENV_PYTHON" -m pip install -r requirements.txt -q)
fi

echo "Starting backend on http://localhost:8000 ..."
(cd "$BACKEND_DIR" && "$VENV_PYTHON" -m uvicorn app.main:app --reload --port 8000) &
BACKEND_PID=$!

sleep 2
if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo "Backend failed to start. Run manually: cd backend && . .venv/bin/activate && uvicorn app.main:app --reload --port 8000"
  exit 1
fi

# Find npm — prefer Homebrew when available
NPM=$(command -v npm 2>/dev/null)
BREW_BIN=""
if [ -z "$NPM" ]; then
  if command -v brew >/dev/null 2>&1; then
    BREW_BIN="$(command -v brew)"
  elif [ -x /opt/homebrew/bin/brew ]; then
    BREW_BIN="/opt/homebrew/bin/brew"
  elif [ -x /usr/local/bin/brew ]; then
    BREW_BIN="/usr/local/bin/brew"
  fi
fi
if [ -z "$NPM" ] && [ -n "$BREW_BIN" ]; then
  BREW_PREFIX="$("$BREW_BIN" --prefix 2>/dev/null || true)"
  if [ -n "$BREW_PREFIX" ] && [ -x "$BREW_PREFIX/bin/npm" ]; then
    export PATH="$BREW_PREFIX/bin:$PATH"
    NPM="$BREW_PREFIX/bin/npm"
  fi
fi
if [ -z "$NPM" ] && [ -s "$HOME/.nvm/nvm.sh" ]; then
  . "$HOME/.nvm/nvm.sh" 2>/dev/null || true
  NPM=$(command -v npm 2>/dev/null)
fi
if [ -z "$NPM" ]; then
  for candidate in "$HOME/.nvm/current/bin/npm" /opt/homebrew/bin/npm /usr/local/bin/npm; do
    if [ -x "$candidate" ]; then
      NPM="$candidate"
      break
    fi
  done
fi

if [ -z "$NPM" ]; then
  echo "Backend is running at http://localhost:8000"
  echo "npm not found. If you use Homebrew, run: /opt/homebrew/bin/brew install node"
  echo "Or install Node.js from https://nodejs.org and ensure npm is in your PATH."
  echo "Then in another terminal: cd frontend && npm install && npm run dev"
  echo "Press Ctrl+C to stop the backend."
  trap "kill $BACKEND_PID 2>/dev/null; exit" INT TERM
  wait $BACKEND_PID
  exit 0
fi

echo "Starting frontend on http://localhost:5173 ..."
echo "Open http://localhost:5173 in your browser. Press Ctrl+C to stop both servers."
trap "kill $BACKEND_PID 2>/dev/null; exit" INT TERM
cd "$ROOT/frontend" && "$NPM" run dev
