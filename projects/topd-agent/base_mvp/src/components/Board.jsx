import Cell from './Cell.jsx';
import './Board.css';

export default function Board({ board, onCellClick, gameOver }) {
  return (
    <div className="board">
      {board.map((row, r) => (
        <div key={r} className="board-row">
          {row.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              cell={cell}
              onClick={onCellClick}
              gameOver={gameOver}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
