import { useRef } from "react";
import MovieCard from "./MovieCard";

function MovieRow({ title, movies }) {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const amount = direction === "left" ? -600 : 600;
      rowRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section className="movie-row">
      <h2 className="movie-row__title">{title}</h2>
      <div className="movie-row__wrapper">
        <button
          className="movie-row__arrow movie-row__arrow--left"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          ‹
        </button>
        <div className="movie-row__posters" ref={rowRef}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        <button
          className="movie-row__arrow movie-row__arrow--right"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default MovieRow;
