import "./OccasionSelector.css";

const OCCASIONS = [
  { value: "", label: "Any Occasion" },
  { value: "casual", label: "Casual" },
  { value: "work", label: "Work" },
  { value: "party", label: "Party" },
  { value: "sport", label: "Sport" },
];

function OccasionSelector({ selectedOccasion, onChange }) {
  const selectValue = selectedOccasion ?? "";

  const handleChange = (e) => {
    const value = e.target.value;
    onChange(value === "" ? null : value);
  };

  return (
    <div className="occasion-selector" role="group" aria-label="Occasion">
      <label htmlFor="occasion-select" className="occasion-selector__label">
        Occasion
      </label>
      <select
        id="occasion-select"
        className="occasion-select"
        value={selectValue}
        onChange={handleChange}
        aria-label="Select occasion"
      >
        {OCCASIONS.map(({ value, label }) => (
          <option key={value || "any"} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default OccasionSelector;
