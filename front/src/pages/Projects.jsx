import { useEffect, useState } from "react";
import { getProjects } from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");

  /* EFFECT - Récupération API de tous les projets */
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
      {/* PROJECTS HEADER - Introduction de la page projets */}
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

      {/* PROJECTS GRID - Liste des projets */}
      {status === "success" && (
        <section className="projects-page-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.id}>
              {/* PROJECT IMAGE - Visuel réel du projet */}
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
