import { useEffect, useRef, useState } from "react";

function QuestionTimer({ secondsPerQuestion, questionKey, onTimeout, isActive }) {
  const [remainingSeconds, setRemainingSeconds] = useState(secondsPerQuestion);
  const hasTimedOutRef = useRef(false);

  useEffect(() => {
    setRemainingSeconds(secondsPerQuestion);
    hasTimedOutRef.current = false;
  }, [questionKey, secondsPerQuestion]);

  useEffect(() => {
    if (!isActive) return undefined;

    const intervalId = setInterval(() => {
      setRemainingSeconds((previousSeconds) => {
        if (previousSeconds <= 1) {
          if (!hasTimedOutRef.current) {
            hasTimedOutRef.current = true;
            onTimeout();
          }
          return 0;
        }

        return previousSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isActive, onTimeout]);

  const isUrgent = remainingSeconds <= 3;

  return (
    <p className={`timer ${isUrgent ? "timer-urgent" : ""}`}>
      Time left: <strong>{remainingSeconds}s</strong>
    </p>
  );
}

export default QuestionTimer;
