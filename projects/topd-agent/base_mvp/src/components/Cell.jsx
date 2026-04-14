import AnthropicLogo from './AnthropicLogo.jsx';
import './Cell.css';

const NUMBER_COLORS = {
  1: '#6a9bcc',
  2: '#788c5d',
  3: '#d97757',
  4: '#8b6abf',
  5: '#c4623f',
  6: '#5a8a7a',
  7: '#141413',
  8: '#b0aea5',
};

export default function Cell({ cell, onClick, gameOver }) {
  const { isRevealed, isMine, adjacentMines } = cell;

  function handleClick() {
    if (isRevealed || gameOver) return;
    onClick(cell.row, cell.col);
  }

  let content = null;
  let className = 'cell';

  if (isRevealed) {
    className += ' revealed';
    if (isMine) {
      className += ' mine';
      content = <AnthropicLogo size={20} />;
    } else if (adjacentMines > 0) {
      content = (
        <span style={{ color: NUMBER_COLORS[adjacentMines] || '#333', fontWeight: 700 }}>
          {adjacentMines}
        </span>
      );
    }
  }

  return (
    <button className={className} onClick={handleClick} aria-label={`Cell ${cell.row},${cell.col}`}>
      {content}
    </button>
  );
}
