import './Grid.css';

export default function Grid({ guesses, currentGuess, targetWord, maxGuesses }) {
  const rows = [];

  for (let i = 0; i < maxGuesses; i++) {
    if (i < guesses.length) {
      rows.push(<CompletedRow key={i} guess={guesses[i]} target={targetWord} />);
    } else if (i === guesses.length) {
      rows.push(<CurrentRow key={i} currentGuess={currentGuess} />);
    } else {
      rows.push(<EmptyRow key={i} />);
    }
  }

  return <div className="grid">{rows}</div>;
}

function CompletedRow({ guess, target }) {
  const colors = getLetterColors(guess, target);
  return (
    <div className="row">
      {guess.split('').map((letter, i) => (
        <div key={i} className={`tile filled ${colors[i]}`}>
          {letter}
        </div>
      ))}
    </div>
  );
}

function CurrentRow({ currentGuess }) {
  const letters = currentGuess.split('');
  const tiles = [];
  for (let i = 0; i < 5; i++) {
    tiles.push(
      <div key={i} className={`tile ${letters[i] ? 'active' : ''}`}>
        {letters[i] || ''}
      </div>
    );
  }
  return <div className="row">{tiles}</div>;
}

function EmptyRow() {
  return (
    <div className="row">
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} className="tile" />
      ))}
    </div>
  );
}

export function getLetterColors(guess, target) {
  const colors = Array(5).fill('absent');
  const targetLetters = target.split('');
  const guessLetters = guess.split('');
  const used = Array(5).fill(false);

  // First pass: mark correct (green)
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      colors[i] = 'correct';
      used[i] = true;
    }
  }

  // Second pass: mark present (yellow)
  for (let i = 0; i < 5; i++) {
    if (colors[i] === 'correct') continue;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guessLetters[i] === targetLetters[j]) {
        colors[i] = 'present';
        used[j] = true;
        break;
      }
    }
  }

  return colors;
}
