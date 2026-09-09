import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

/* Header contient la navigation principale et le menu responsive. */
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /* Après un clic, le menu mobile se referme pour laisser la page visible. */
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${isMenuOpen ? "menu-open" : ""}`}>
      <NavLink to="/" className="logo" onClick={closeMenu}>
        Albert.<span>TAYO</span>
      </NavLink>

      {/* Bouton affiché sur mobile pour ouvrir ou fermer la navigation. */}
      <button
        type="button"
        className="burger-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Liens internes du portfolio, gérés par React Router. */}
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

        {/* Lien direct vers le CV PDF placé dans le dossier public. */}
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
