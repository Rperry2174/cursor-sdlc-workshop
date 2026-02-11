/**
 * Win or lose screen with restart option.
 * Accepts children (e.g. Scoreboard) to render final stats.
 */
export default function GameOverScreen({ won, onRestart, children }) {
  return (
    <div className="game-over-screen">
      <h1>{won ? 'You made it to the ocean!' : 'You hit an iceberg!'}</h1>
      <p>{won ? 'Victory!' : 'Try again.'}</p>
      {children}
      <button type="button" onClick={onRestart} className="restart-button">
        Play Again
      </button>
    </div>
  );
}
