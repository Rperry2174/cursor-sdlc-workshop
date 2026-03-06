import { useState, useEffect } from "react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__left">
        <span className="navbar__logo">NETFLIX</span>
        <span className="navbar__link">Home</span>
        <span className="navbar__link">TV Shows</span>
        <span className="navbar__link">Movies</span>
        <span className="navbar__link">New &amp; Popular</span>
        <span className="navbar__link">My List</span>
      </div>
      <div className="navbar__right">
        <span className="navbar__icon">&#128269;</span>
        <span className="navbar__icon">&#128276;</span>
        <div className="navbar__avatar">U</div>
      </div>
    </nav>
  );
}

export default Navbar;
