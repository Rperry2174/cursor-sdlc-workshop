import { useMemo, useState } from "react";

const QUESTIONS = [
  {
    prompt: "Which planet is known as the Red Planet?",
    choices: ["Earth", "Mars", "Venus", "Jupiter"],
    answer: "Mars",
  },
  {
    prompt: "What does CSS stand for?",
    choices: [
      "Computer Style Sheets",
      "Cascading Style Sheets",
      "Creative Style System",
      "Colorful Style Syntax",
    ],
    answer: "Cascading Style Sheets",
  },
  {
    prompt: "How many minutes are in one hour?",
    choices: ["30", "45", "60", "90"],
    answer: "60",
  },
  {
    prompt: "Which language runs in the browser?",
    choices: ["Java", "C#", "JavaScript", "Python"],
    answer: "JavaScript",
  },
  {
    prompt: "What is 9 x 7?",
    choices: ["56", "63", "72", "81"],
    answer: "63",
  },
];

function App() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = QUESTIONS[questionIndex];
  const progressLabel = useMemo(
    () => `Question ${questionIndex + 1} of ${QUESTIONS.length}`,
    [questionIndex],
  );

  const handleNext = () => {
    if (!selectedAnswer) return;

    if (selectedAnswer === currentQuestion.answer) {
      setScore((previous) => previous + 1);
    }

    const isLastQuestion = questionIndex === QUESTIONS.length - 1;
    if (isLastQuestion) {
      setIsFinished(true);
      return;
    }

    setQuestionIndex((previous) => previous + 1);
    setSelectedAnswer("");
  };

  const handlePlayAgain = () => {
    setQuestionIndex(0);
    setScore(0);
    setSelectedAnswer("");
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <main className="app">
        <section className="card">
          <h1>Quick Quiz Blitz</h1>
          <p className="subtitle">Nice run. Here is your final score.</p>
          <p className="score">
            {score} / {QUESTIONS.length}
          </p>
          <button className="button" onClick={handlePlayAgain}>
            Play Again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <section className="card">
        <h1>Quick Quiz Blitz</h1>
        <p className="subtitle">{progressLabel}</p>
        <h2>{currentQuestion.prompt}</h2>

        <div className="answers">
          {currentQuestion.choices.map((choice) => (
            <button
              className={`answer ${selectedAnswer === choice ? "selected" : ""}`}
              key={choice}
              onClick={() => setSelectedAnswer(choice)}
            >
              {choice}
            </button>
          ))}
        </div>

        <button className="button" disabled={!selectedAnswer} onClick={handleNext}>
          {questionIndex === QUESTIONS.length - 1 ? "Finish Quiz" : "Next Question"}
        </button>
      </section>
    </main>
  );
}

export default App;
