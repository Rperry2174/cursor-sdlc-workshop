/**
 * Win or lose screen with restart option.
 */
export default function GameOverScreen({ won, onRestart }) {
  return (
    <div className="game-over-screen">
      <h1>{won ? 'You made it to the ocean!' : 'You hit an iceberg!'}</h1>
      <p>{won ? 'Victory!' : 'Try again.'}</p>
      <button type="button" onClick={onRestart} className="restart-button">
        Play Again
      </button>
    </div>
  );
}
