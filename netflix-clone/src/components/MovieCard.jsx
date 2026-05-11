function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <div className="movie-card__poster" style={{ background: movie.bg }}>
        <span className="movie-card__label">{movie.title}</span>
      </div>
    </div>
  );
}

export default MovieCard;
