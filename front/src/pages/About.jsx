import { FaBolt, FaGem, FaUsers } from "react-icons/fa";
import profileImage from "../assets/albert-profile.jpeg";

function About() {
  return (
    <main className="about-page">
      {/* DECORATION - Cercles lumineux d'arriere-plan */}
      <div className="about-circle about-circle-top"></div>
      <div className="about-circle about-circle-bottom"></div>

      <section className="about-container">
        {/* IMAGE - Portrait professionnel */}
        <div className="about-image-wrapper">
          <img src={profileImage} alt="Portrait professionnel de Albert TAYO" />

          <div className="available-card">
            <span>✓</span>
            <div>
              <strong>Disponible</strong>
              <p>Alternance 2026</p>
            </div>
          </div>
        </div>

        {/* CONTENU - Presentation personnelle */}
        <div className="about-content">
          <p className="section-label">À PROPOS</p>

          <h1>Passionné par la technologie et l'humain</h1>

          <h2>Développeur Full-Stack en construction</h2>

          <p className="about-text">
            Étudiant à la Fabrique Numérique Paloise, je développe des interfaces
            modernes, claires et maintenables. Mon objectif : transformer des idées
            en applications web utiles, accessibles et performantes.
          </p>

          <div className="values-grid">
            <article className="value-card">
              <span>
                <FaBolt />
              </span>
              <h3>Rigueur</h3>
              <p>Code propre et logique</p>
            </article>

            <article className="value-card">
              <span>
                <FaGem />
              </span>
              <h3>Curiosité</h3>
              <p>Apprendre et progresser</p>
            </article>

            <article className="value-card">
              <span className="team-icon">
                <FaUsers />
              </span>
              <h3>Équipe</h3>
              <p>Avancer ensemble</p>
            </article>
          </div>

          <div className="tech-box">
            <h3>Technologies principales</h3>
            <p>Première base technique du portfolio dynamique avec administration.</p>

            <div className="tech-list">
              <span>React</span>
              <span>Node.js</span>
              <span>Express</span>
              <span>MongoDB</span>
              <span>Figma</span>
            </div>
          </div>

          <a href="#competences" className="about-button">
            Voir mes compétences →
          </a>
        </div>
      </section>
    </main>
  );
}

export default About;
