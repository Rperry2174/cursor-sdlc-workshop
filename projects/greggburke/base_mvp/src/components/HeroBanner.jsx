function HeroBanner({ onBookNowClick }) {
  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1 className="hero-title">Riverfront RV Park</h1>
        <p className="hero-subtitle">
          Make your summer <em>Unforgettable!</em>
        </p>
        <p className="hero-location">
          1020 Front St. New Richmond, OH 45157 &mdash; Along a half mile of
          Ohio River shoreline
        </p>
        <button className="btn btn-primary" onClick={onBookNowClick}>
          Book Now!
        </button>
      </div>
    </section>
  );
}

export default HeroBanner;
