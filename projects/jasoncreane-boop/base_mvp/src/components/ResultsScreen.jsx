function ResultsScreen({ liked, onReset }) {
  const formatPrice = (price) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(price);

  function buildMailtoLink() {
    const uniqueAgents = [...new Map(
      liked.map((p) => [p.agentEmail, p.agent])
    )];

    const toAddresses = uniqueAgents.map(([email]) => email).join(',');

    const subject = encodeURIComponent(
      `Viewing Request — ${liked.length} ${liked.length === 1 ? 'Property' : 'Properties'} via ManxPad`
    );

    const propertyLines = liked
      .map(
        (p) =>
          `• ${p.name}\n  ${p.address}\n  ${formatPrice(p.price)} · ${p.bedrooms} bed · ${p.bathrooms} bath\n  Listed by: ${p.agent}`
      )
      .join('\n\n');

    const body = encodeURIComponent(
      `Dear Estate Agent,\n\nI have been browsing properties on the Isle of Man and would love to arrange viewings for the following:\n\n${propertyLines}\n\nCould you please let me know your available times?\n\nMany thanks`
    );

    return `mailto:${toAddresses}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="results">
      <h2 className="results-title">
        You liked {liked.length} {liked.length === 1 ? 'property' : 'properties'}
      </h2>

      {liked.length === 0 ? (
        <p className="results-empty">
          No properties caught your eye this time. Try again!
        </p>
      ) : (
        <>
          <ul className="results-list">
            {liked.map((prop) => (
              <li key={prop.id} className="results-item">
                <img src={prop.image} alt={prop.name} className="results-thumb" />
                <div className="results-item-info">
                  <strong>{prop.name}</strong>
                  <span className="results-item-price">{formatPrice(prop.price)}</span>
                  <span className="results-item-detail">
                    {prop.bedrooms} bed &middot; {prop.town} &middot; {prop.agent}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <a href={buildMailtoLink()} className="btn btn-schedule">
            Schedule Viewings
          </a>

          <p className="schedule-hint">
            Opens your email app with a pre-written message to{' '}
            {[...new Set(liked.map((p) => p.agent))].join(', ')}
          </p>
        </>
      )}

      <button className="btn btn-primary" onClick={onReset}>
        Start Over
      </button>
    </div>
  );
}

export default ResultsScreen;
