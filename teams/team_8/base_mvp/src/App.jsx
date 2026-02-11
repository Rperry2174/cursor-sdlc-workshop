import GameCanvas from "./GameCanvas";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>Pong</h1>
      <GameCanvas />
      <p className="controls">
        <span>Player 1: <kbd>W</kbd> / <kbd>S</kbd></span>
        <span>Player 2: <kbd>↑</kbd> / <kbd>↓</kbd></span>
      </p>
    </div>
  );
}

export default App;
