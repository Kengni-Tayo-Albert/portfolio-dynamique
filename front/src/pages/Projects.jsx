import { useEffect, useState } from "react";
import { getProjects } from "../services/api";

/* Projects affiche toutes les réalisations disponibles dans l'API ou le JSON statique. */
function Projects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");

  /* Charge tous les projets pour garder la page synchronisée avec le back-office. */
  useEffect(() => {
    async function loadProjects() {
      try {
        const apiProjects = await getProjects();

        setProjects(apiProjects);
        setStatus("success");
      } catch (error) {
        console.error("Erreur pendant le chargement des projets :", error);
        setStatus("error");
      }
    }

    loadProjects();
  }, []);

  return (
    <main className="projects-page">
      {/* Introduction courte avant la grille complète des réalisations. */}
      <section className="projects-intro">
        <p className="section-label">PROJETS</p>
        <h1>Tous mes projets</h1>
        <p>
          Six réalisations présentées avec image, description, technologies,
          lien GitHub et démo en ligne.
        </p>
        <div className="section-line"></div>
      </section>

      {status === "loading" && (
        <p className="api-state">Chargement des projets...</p>
      )}

      {status === "error" && (
        <p className="api-state">
          Les projets ne sont pas disponibles pour le moment.
        </p>
      )}

      {/* Grille alimentée par les données projets. */}
      {status === "success" && (
        <section className="projects-page-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.id}>
              <div className="project-image">
                <img
                  src={project.image}
                  alt={`Aperçu du projet ${project.title}`}
                />
              </div>

              <h2>{project.title}</h2>

              <p>{project.subtitle}</p>

              <p className="project-description">{project.description}</p>

              <div className="tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

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
        </section>
      )}
    </main>
  );
}

export default Projects;
