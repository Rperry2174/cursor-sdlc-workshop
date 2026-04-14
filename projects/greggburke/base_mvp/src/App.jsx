import { useState, useRef } from 'react';
import { spots as initialSpots } from './data';
import HeroBanner from './components/HeroBanner';
import DatePicker from './components/DatePicker';
import SpotList from './components/SpotList';
import BookingConfirmation from './components/BookingConfirmation';
import './App.css';

function App() {
  const [spots, setSpots] = useState(initialSpots);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [pendingSpotId, setPendingSpotId] = useState(null);
  const bookingSectionRef = useRef(null);

  function handleDateChange(newCheckIn, newCheckOut) {
    setCheckIn(newCheckIn);
    setCheckOut(newCheckOut);
  }

  function handleBook(spotId) {
    setPendingSpotId(spotId);
  }

  function confirmBooking() {
    setSpots((prev) =>
      prev.map((s) => (s.id === pendingSpotId ? { ...s, status: 'booked' } : s))
    );
    setPendingSpotId(null);
  }

  function cancelBooking() {
    setPendingSpotId(null);
  }

  const pendingSpot = spots.find((s) => s.id === pendingSpotId);

  function scrollToBooking() {
    bookingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const availableCount = spots.filter((s) => s.status === 'available').length;

  return (
    <div className="app">
      <HeroBanner onBookNowClick={scrollToBooking} />

      <section className="about-section">
        <span className="section-eyebrow">— about us —</span>
        <h2>Your Riverfront Escape — Open All Year!</h2>
        <p>
          Riverfront RV Park is a serene retreat nestled along a half mile of
          Ohio River shoreline. Located less than 30 minutes from downtown
          Cincinnati, OH, it offers a convenient escape from the hustle and
          bustle. The park boasts spacious sites that provide ample room and
          privacy for your relaxation.
        </p>
      </section>

      <section className="amenities-section">
        <span className="section-eyebrow">— amenities —</span>
        <h2>What Every Site Includes</h2>
        <div className="amenities-grid">
          {[
            'Electric (20/30/50 Amp)',
            'Water',
            'Sewage',
            'WiFi',
            'River Access',
            'Fire Rings & Picnic Tables',
          ].map((a) => (
            <div key={a} className="amenity-item">{a}</div>
          ))}
        </div>
      </section>

      <section className="booking-section" ref={bookingSectionRef}>
        <span className="section-eyebrow">— book your stay —</span>
        <h2>Browse Available Sites</h2>
        <p className="available-count">
          {availableCount} of {spots.length} sites available
        </p>

        <DatePicker
          checkIn={checkIn}
          checkOut={checkOut}
          onChange={handleDateChange}
        />

        <SpotList
          spots={spots}
          checkIn={checkIn}
          checkOut={checkOut}
          onBook={handleBook}
        />
      </section>

      <footer className="footer">
        <p>Riverfront RV Park</p>
        <p>1020 Front St. New Richmond, OH 45157</p>
        <p className="footer-copy">&copy; {new Date().getFullYear()} Riverfront RV Park. All rights reserved.</p>
      </footer>

      {pendingSpot && (
        <BookingConfirmation
          spot={pendingSpot}
          checkIn={checkIn}
          checkOut={checkOut}
          onConfirm={confirmBooking}
          onCancel={cancelBooking}
        />
      )}
    </div>
  );
}

export default App;
