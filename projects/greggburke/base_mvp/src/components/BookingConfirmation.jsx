import { calculateTotal, getNightCount } from '../data';

function BookingConfirmation({ spot, checkIn, checkOut, onConfirm, onCancel }) {
  const nights = getNightCount(checkIn, checkOut);
  const total = calculateTotal(checkIn, checkOut, spot.pricing);

  const formatDate = (dateStr) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div className="confirmation-overlay" onClick={onCancel}>
      <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="confirmation-title">Confirm Your Booking</h2>

        <div className="confirmation-details">
          <div className="confirmation-row">
            <span className="confirmation-label">Site</span>
            <span className="confirmation-value">
              #{spot.number} &mdash; {spot.type}
            </span>
          </div>

          <div className="confirmation-row">
            <span className="confirmation-label">Check-in</span>
            <span className="confirmation-value">{formatDate(checkIn)}</span>
          </div>

          <div className="confirmation-row">
            <span className="confirmation-label">Check-out</span>
            <span className="confirmation-value">{formatDate(checkOut)}</span>
          </div>

          <div className="confirmation-row">
            <span className="confirmation-label">Duration</span>
            <span className="confirmation-value">
              {nights} night{nights !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="confirmation-divider" />

          <div className="confirmation-row confirmation-row--total">
            <span className="confirmation-label">Total</span>
            <span className="confirmation-value">${total}</span>
          </div>
        </div>

        <div className="confirmation-actions">
          <button className="btn btn-confirm" onClick={onConfirm}>
            Confirm Booking
          </button>
          <button className="btn btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
