import { calculateTotal, getNightCount } from '../data';

function SpotCard({ spot, checkIn, checkOut, onBook }) {
  const nights = getNightCount(checkIn, checkOut);
  const total = calculateTotal(checkIn, checkOut, spot.pricing);
  const isBooked = spot.status === 'booked';
  const datesSelected = checkIn && checkOut;

  return (
    <div className={`spot-card ${isBooked ? 'spot-card--booked' : ''}`}>
      <div className="spot-card__header">
        <span className="spot-card__number">#{spot.number}</span>
        <span className={`spot-card__badge spot-card__badge--${spot.type === 'Riverfront' ? 'riverfront' : 'fourseason'}`}>
          {spot.type}
        </span>
      </div>

      <div className="spot-card__pricing">
        <div className="spot-card__rate">
          <span className="spot-card__price">${spot.pricing.daily}</span>
          <span className="spot-card__label">/ night (Sun–Wed)</span>
        </div>
        <div className="spot-card__rate">
          <span className="spot-card__price">${spot.pricing.weekend}</span>
          <span className="spot-card__label">/ night (Thu–Sun)</span>
        </div>
      </div>

      {datesSelected && !isBooked && (
        <div className="spot-card__total">
          {nights} night{nights !== 1 ? 's' : ''} &mdash; <strong>${total}</strong>
        </div>
      )}

      {isBooked ? (
        <div className="spot-card__booked-label">Booked</div>
      ) : (
        <button
          className="btn btn-book"
          disabled={!datesSelected}
          onClick={() => onBook(spot.id)}
          title={!datesSelected ? 'Select dates first' : ''}
        >
          {datesSelected ? 'Book Now' : 'Select Dates to Book'}
        </button>
      )}
    </div>
  );
}

function SpotList({ spots, checkIn, checkOut, onBook }) {
  const riverfront = spots.filter((s) => s.type === 'Riverfront');
  const fourSeason = spots.filter((s) => s.type === 'Four Season');

  return (
    <section className="spot-list-section">
      <div className="spot-group">
        <h2 className="spot-group__title">
          Riverfront Sites (#1–62)
          <span className="spot-group__subtitle">Along the Ohio River shoreline</span>
        </h2>
        <div className="spot-grid">
          {riverfront.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              checkIn={checkIn}
              checkOut={checkOut}
              onBook={onBook}
            />
          ))}
        </div>
      </div>

      <div className="spot-group">
        <h2 className="spot-group__title">
          Four Season Sites (#63–107)
          <span className="spot-group__subtitle">Open year-round</span>
        </h2>
        <div className="spot-grid">
          {fourSeason.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              checkIn={checkIn}
              checkOut={checkOut}
              onBook={onBook}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default SpotList;
