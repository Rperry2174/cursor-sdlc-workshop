function PropertyCard({ property }) {
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <div className="property-card">
      <div className="property-image-wrapper">
        <img
          src={property.image}
          alt={property.name}
          className="property-image"
        />
        <span className="property-type-badge">{property.type}</span>
      </div>

      <div className="property-info">
        <h2 className="property-name">{property.name}</h2>
        <p className="property-address">{property.address}</p>
        <p className="property-price">{formattedPrice}</p>

        <div className="property-stats">
          <span className="stat">
            <span className="stat-icon">bed</span> {property.bedrooms} bed
          </span>
          <span className="stat">
            <span className="stat-icon">bath</span> {property.bathrooms} bath
          </span>
        </div>

        <p className="property-description">{property.description}</p>

        <p className="property-agent">
          Listed by <strong>{property.agent}</strong>
        </p>
      </div>
    </div>
  );
}

export default PropertyCard;
