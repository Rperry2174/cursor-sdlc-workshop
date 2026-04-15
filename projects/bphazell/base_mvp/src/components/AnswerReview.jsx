function AnswerReview({ entries }) {
  if (!entries.length) {
    return null;
  }

  return (
    <section className="answer-review">
      <h2>Answer Review</h2>
      <ul className="answer-review-list">
        {entries.map((entry) => (
          <li className="answer-review-item" key={`${entry.questionIndex}-${entry.prompt}`}>
            <p className="answer-review-question">
              {entry.questionIndex + 1}. {entry.prompt}
            </p>
            <p className="answer-review-row">
              <strong>Your answer:</strong>{" "}
              {entry.selectedAnswer || (entry.isTimeout ? "No answer (time ran out)" : "No answer")}
            </p>
            <p className="answer-review-row">
              <strong>Correct answer:</strong> {entry.correctAnswer}
            </p>
            <p className={`answer-review-status ${entry.isCorrect ? "is-correct" : "is-incorrect"}`}>
              {entry.isCorrect ? "Correct" : "Incorrect"}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AnswerReview;
