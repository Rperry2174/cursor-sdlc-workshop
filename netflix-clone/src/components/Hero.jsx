import { FEATURED } from "../data/movies";

function Hero() {
  return (
    <header className="hero" style={{ background: FEATURED.gradient }}>
      <div className="hero__overlay" />
      <div className="hero__content">
        <h1 className="hero__title">{FEATURED.title}</h1>
        <p className="hero__description">{FEATURED.description}</p>
        <div className="hero__buttons">
          <button className="hero__btn hero__btn--play">&#9654; Play</button>
          <button className="hero__btn hero__btn--info">&#8505; More Info</button>
        </div>
      </div>
    </header>
  );
}

export default Hero;
