import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${isMenuOpen ? "menu-open" : ""}`}>
      {/* LOGO - Identité principale du portfolio */}
      <NavLink to="/" className="logo" onClick={closeMenu}>
        Albert.<span>TAYO</span>
      </NavLink>

      {/* BURGER - Bouton visible en responsive */}
      <button
        type="button"
        className="burger-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* NAVIGATION - Liens internes sans rechargement */}
      <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
        <NavLink to="/" onClick={closeMenu}>
          Accueil
        </NavLink>
        <NavLink to="/a-propos" onClick={closeMenu}>
          À propos
        </NavLink>
        <NavLink to="/cv" onClick={closeMenu}>
          CV
        </NavLink>
        <NavLink to="/competences" onClick={closeMenu}>
          Compétences
        </NavLink>
        <NavLink to="/projets" onClick={closeMenu}>
          Projets
        </NavLink>
        <NavLink to="/contact" onClick={closeMenu}>
          Contact
        </NavLink>

        {/* ACTION - Téléchargement du CV */}
        <a
          href="/cv-albert-tayo.pdf"
          download="CV-Albert-Tayo.pdf"
          className="btn-cv"
          onClick={closeMenu}
        >
          Télécharger CV
        </a>
      </nav>
    </header>
  );
}

export default Header;
