import { useState } from 'react';
import questions from './data/questions.js';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  function handleAnswer(choiceIndex) {
    if (showResult) return;

    setSelectedAnswer(choiceIndex);
    setShowResult(true);

    if (choiceIndex === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setQuizFinished(true);
      }
      setSelectedAnswer(null);
      setShowResult(false);
    }, 1200);
  }

  function handleRestart() {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizFinished(false);
  }

  if (quizFinished) {
    return (
      <div className="app">
        <div className="card end-screen">
          <h1>Quiz Complete!</h1>
          <p className="final-score">
            {score} / {questions.length}
          </p>
          <p className="final-message">
            {score === questions.length
              ? "Perfect score!"
              : score >= questions.length * 0.7
                ? "Great job!"
                : score >= questions.length * 0.4
                  ? "Not bad — keep learning!"
                  : "Better luck next time!"}
          </p>
          <button className="btn play-again" onClick={handleRestart}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="card">
        <div className="progress">
          Question {currentIndex + 1} of {questions.length}
        </div>
        <h2 className="question">{currentQuestion.question}</h2>
        <div className="choices">
          {currentQuestion.choices.map((choice, i) => {
            let className = 'btn choice';
            if (showResult) {
              if (i === currentQuestion.answer) className += ' correct';
              else if (i === selectedAnswer) className += ' wrong';
            }
            return (
              <button
                key={i}
                className={className}
                onClick={() => handleAnswer(i)}
                disabled={showResult}
              >
                {choice}
              </button>
            );
          })}
        </div>
        <div className="score">Score: {score}</div>
      </div>
    </div>
  );
}

export default App;
