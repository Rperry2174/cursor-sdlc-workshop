function GameOverScreen({ won, onRestart }) {
  return (
    <div className="game-over-screen">
      <h1>{won ? 'You reached the ocean!' : 'Game Over'}</h1>
      <p>{won ? 'You won!' : 'You hit an iceberg.'}</p>
      <button type="button" onClick={onRestart}>
        Play Again
      </button>
    </div>
  )
}

export default GameOverScreen
