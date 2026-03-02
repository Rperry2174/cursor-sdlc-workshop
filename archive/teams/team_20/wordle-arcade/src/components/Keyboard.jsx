import './Keyboard.css';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

export default function Keyboard({ onKey, letterStates }) {
  const handleClick = (key) => {
    if (key === '⌫') {
      onKey('BACKSPACE');
    } else {
      onKey(key);
    }
  };

  return (
    <div className="keyboard">
      {ROWS.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map((key) => {
            const state = letterStates[key] || '';
            const isWide = key === 'ENTER' || key === '⌫';
            return (
              <button
                key={key}
                className={`key ${state} ${isWide ? 'wide' : ''}`}
                onClick={() => handleClick(key)}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
