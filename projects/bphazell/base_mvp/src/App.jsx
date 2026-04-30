import { useCallback, useMemo, useRef, useState } from "react";
import AnswerReview from "./components/AnswerReview";
import CategorySelector from "./components/CategorySelector";
import QuestionTimer from "./components/QuestionTimer";
import questionsByCategory from "./data/questionsByCategory";

const SECONDS_PER_QUESTION = 10;

function App() {
  const categoryNames = useMemo(() => Object.keys(questionsByCategory), []);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [hasStartedQuiz, setHasStartedQuiz] = useState(false);
  const [answerHistory, setAnswerHistory] = useState([]);
  const isTransitioningRef = useRef(false);

  const questions = selectedCategory ? questionsByCategory[selectedCategory] : [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[questionIndex];
  const progressLabel = useMemo(
    () => `Question ${questionIndex + 1} of ${totalQuestions}`,
    [questionIndex, totalQuestions],
  );

  const advanceQuestion = useCallback(
    ({ answer, isTimeout }) => {
      if (isTransitioningRef.current || isFinished || !currentQuestion) return;
      isTransitioningRef.current = true;
      const isCorrect = !isTimeout && answer === currentQuestion.answer;

      setAnswerHistory((previous) => [
        ...previous,
        {
          questionIndex,
          prompt: currentQuestion.prompt,
          selectedAnswer: answer,
          correctAnswer: currentQuestion.answer,
          isCorrect,
          isTimeout,
        },
      ]);

      if (isCorrect) {
        setScore((previous) => previous + 1);
      }

      const isLastQuestion = questionIndex === totalQuestions - 1;
      if (isLastQuestion) {
        setIsFinished(true);
      } else {
        setQuestionIndex((previous) => previous + 1);
        setSelectedAnswer("");
      }

      queueMicrotask(() => {
        isTransitioningRef.current = false;
      });
    },
    [currentQuestion, isFinished, questionIndex, totalQuestions],
  );

  const handleNext = () => {
    if (!selectedAnswer) return;
    advanceQuestion({ answer: selectedAnswer, isTimeout: false });
  };

  const handleTimeout = useCallback(() => {
    advanceQuestion({ answer: "", isTimeout: true });
  }, [advanceQuestion]);

  const handleStartQuiz = () => {
    if (!selectedCategory) return;
    setQuestionIndex(0);
    setScore(0);
    setSelectedAnswer("");
    setIsFinished(false);
    setHasStartedQuiz(true);
    setAnswerHistory([]);
    isTransitioningRef.current = false;
  };

  const handlePlayAgain = () => {
    setQuestionIndex(0);
    setScore(0);
    setSelectedAnswer("");
    setIsFinished(false);
    setHasStartedQuiz(true);
    setAnswerHistory([]);
    isTransitioningRef.current = false;
  };

  const handleChangeCategory = () => {
    setHasStartedQuiz(false);
    setQuestionIndex(0);
    setScore(0);
    setSelectedAnswer("");
    setIsFinished(false);
    setAnswerHistory([]);
    isTransitioningRef.current = false;
  };

  if (!hasStartedQuiz) {
    return (
      <main className="app">
        <section className="card">
          <h1>Quick Quiz Blitz</h1>
          <p className="subtitle">Choose a category before you start.</p>
          <CategorySelector
            categories={categoryNames}
            onSelect={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
          <button className="button" disabled={!selectedCategory} onClick={handleStartQuiz}>
            Start Quiz
          </button>
        </section>
      </main>
    );
  }

  if (isFinished) {
    return (
      <main className="app">
        <section className="card">
          <h1>Quick Quiz Blitz</h1>
          <p className="subtitle">Category: {selectedCategory}</p>
          <p className="subtitle">Nice run. Here is your final score.</p>
          <p className="score">
            {score} / {totalQuestions}
          </p>
          <AnswerReview entries={answerHistory} />
          <button className="button button-spacing" onClick={handlePlayAgain}>
            Play Again
          </button>
          <button className="button button-secondary" onClick={handleChangeCategory}>
            Change Category
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
        <QuestionTimer
          isActive={!isFinished}
          onTimeout={handleTimeout}
          questionKey={`${selectedCategory}-${questionIndex}`}
          secondsPerQuestion={SECONDS_PER_QUESTION}
        />
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
          {questionIndex === totalQuestions - 1 ? "Finish Quiz" : "Next Question"}
        </button>
      </section>
    </main>
  );
}

export default App;
