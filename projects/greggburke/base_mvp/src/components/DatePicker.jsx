function DatePicker({ checkIn, checkOut, onChange }) {
  const today = new Date().toISOString().split('T')[0];

  function handleCheckInChange(e) {
    const newCheckIn = e.target.value;
    onChange(newCheckIn, checkOut && newCheckIn >= checkOut ? '' : checkOut);
  }

  function handleCheckOutChange(e) {
    onChange(checkIn, e.target.value);
  }

  const minCheckOut = checkIn
    ? new Date(new Date(checkIn).getTime() + 2 * 86400000)
        .toISOString()
        .split('T')[0]
    : today;

  return (
    <div className="date-picker">
      <div className="date-field">
        <label htmlFor="check-in">Check-in</label>
        <input
          type="date"
          id="check-in"
          value={checkIn}
          min={today}
          onChange={handleCheckInChange}
        />
      </div>
      <div className="date-field">
        <label htmlFor="check-out">Check-out</label>
        <input
          type="date"
          id="check-out"
          value={checkOut}
          min={minCheckOut}
          onChange={handleCheckOutChange}
          disabled={!checkIn}
        />
      </div>
    </div>
  );
}

export default DatePicker;
