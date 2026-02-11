import "./MoodSelector.css";

const MOODS = ["chill", "bold", "cozy", "energetic", "confident", "relaxed"];

function MoodSelector({ selectedMood, onMoodChange }) {
  return (
    <div className="mood-selector">
      <span className="mood-label">Mood:</span>
      <div className="mood-buttons">
        <button
          className={`mood-btn ${selectedMood === null ? "active" : ""}`}
          onClick={() => onMoodChange(null)}
        >
          Any Mood
        </button>
        {MOODS.map((mood) => (
          <button
            key={mood}
            className={`mood-btn ${selectedMood === mood ? "active" : ""}`}
            onClick={() => onMoodChange(mood)}
          >
            {mood.charAt(0).toUpperCase() + mood.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MoodSelector;
