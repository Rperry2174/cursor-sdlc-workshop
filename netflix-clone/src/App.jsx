import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MovieRow from "./components/MovieRow";
import { CATEGORIES } from "./data/movies";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <div className="app__rows">
        {CATEGORIES.map((category) => (
          <MovieRow
            key={category.title}
            title={category.title}
            movies={category.movies}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
