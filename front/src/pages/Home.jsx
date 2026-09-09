import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import profileImage from "../assets/albert-profile.jpeg";
import { getProjects } from "../services/api";

/* Home présente l'identité, les liens principaux et une sélection de projets mis en avant. */
function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [projectsStatus, setProjectsStatus] = useState("loading");

  /* Charge les projets publics, garde seulement ceux marqués comme importants et limite l'accueil à trois cartes. */
  useEffect(() => {
    async function loadFeaturedProjects() {
      try {
        const apiProjects = await getProjects();
        const selectedProjects = apiProjects
          .filter((project) => project.featured)
          .slice(0, 3);

        setFeaturedProjects(selectedProjects);
        setProjectsStatus("success");
      } catch (error) {
        console.error("Erreur pendant le chargement des projets :", error);
        setProjectsStatus("error");
      }
    }

    loadFeaturedProjects();
  }, []);

  /* Déplace le halo doré dans la carte de profil sans modifier les données React. */
  useEffect(() => {
    const profileCard = document.querySelector(".profile-card-front");
    const orb = document.getElementById("goldOrb");

    if (!profileCard || !orb) return;

    const moveOrb = (event) => {
      const rect = profileCard.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      orb.style.left = `${x}px`;
      orb.style.top = `${y}px`;
    };

    profileCard.addEventListener("mousemove", moveOrb);

    return () => {
      profileCard.removeEventListener("mousemove", moveOrb);
    };
  }, []);

  return (
    <>
      <main id="accueil" className="hero">
        {/* Présentation courte : identité, spécialité et liens d'action. */}
        <section className="hero-content">
          <p className="intro">Bonjour, je suis</p>

          <h1>Albert TAYO</h1>

          <h2>
            Développeur <span>Full-Stack</span>
          </h2>

          <div className="separator"></div>

          <p className="description">
            Passionné par la création d'applications web modernes et
            performantes. Je transforme des idées en solutions digitales
            robustes, élégantes et maintenables.
          </p>

          <div className="hero-buttons">
            <Link to="/projets" className="primary-button">
              Voir mes projets →
            </Link>

            <Link to="/contact" className="secondary-button">
              Me contacter ➤
            </Link>
          </div>

          {/* Liens professionnels utilisés pour contacter ou vérifier le profil. */}
          <div className="social-links">
            <a
              href="https://www.linkedin.com/in/albert-tayo/?skipRedirect=true"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin className="social-icon" />
              LinkedIn
            </a>

            <a
              href="https://github.com/Kengni-Tayo-Albert"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub className="social-icon" />
              GitHub
            </a>

            <a href="mailto:kengnitayojunior@gmail.com">
              <FaEnvelope className="social-icon" />
              Email
            </a>
          </div>
        </section>

        {/* Visuel principal : portrait animé et éléments décoratifs de l'accueil. */}
        <section className="hero-visual">
          <div className="blue-shape"></div>
          <div className="orange-ring"></div>
          <div className="code-badge">&lt;/&gt;</div>

          {/* Carte interactive : la face arrière affiche trois valeurs de travail. */}
          <div className="profile-flip-card">
            <div className="profile-card-inner">
              <div className="profile-card profile-card-front">
                <img
                  src={profileImage}
                  alt="Portrait professionnel de Albert TAYO"
                />

                <div className="gold-lines"></div>
                <div className="gold-orb" id="goldOrb"></div>
              </div>

              <div className="profile-card profile-card-back">
                <p>EXCELLENCE</p>
                <p>TRAVAIL</p>
                <p>DISCIPLINE</p>
              </div>
            </div>
          </div>
        </section>

        {/* Raccourci vers la page complète des projets. */}
        <Link
          to="/projets"
          className="scroll-button more-projects-button"
          aria-label="Voir tous les projets"
        >
          +
        </Link>
      </main>

      <section id="projets" className="projects-section">
        <h2>PROJETS LES PLUS MARQUANTS</h2>

        <p>Une sélection simple de mes trois réalisations.</p>

        {projectsStatus === "loading" && (
          <p className="api-state">Chargement des projets...</p>
        )}

        {projectsStatus === "error" && (
          <p className="api-state">
            Les projets ne sont pas disponibles pour le moment.
          </p>
        )}

        {/* Les cartes sont générées depuis les données reçues par l'API. */}
        {projectsStatus === "success" && (
          <div className="projects-grid">
            {featuredProjects.map((project) => (
              <article key={project.id} className="project-card">
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                </div>

                <h3>{project.title}</h3>

                <p>{project.shortDescription}</p>

                {/* Chaque tag indique une technologie utilisée dans le projet. */}
                <div className="tags">
                  {project.tags.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>

                {/* Liens vers le code source et la démo publique du projet. */}
                <div className="project-actions">
                  <a href={project.github} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                  <a href={project.demo} target="_blank" rel="noreferrer">
                    Démo
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Home;
