import { useEffect, useState } from "react";
import {
  FaBootstrap,
  FaCheckCircle,
  FaCode,
  FaCodeBranch,
  FaComments,
  FaCss3Alt,
  FaDocker,
  FaGitAlt,
  FaGithub,
  FaHtml5,
  FaJs,
  FaLightbulb,
  FaNodeJs,
  FaPlug,
  FaReact,
  FaRobot,
  FaServer,
  FaTools,
  FaUserCheck,
  FaUsers,
} from "react-icons/fa";
import {
  SiExpress,
  SiFigma,
  SiJsonwebtokens,
  SiMongodb,
  SiMongoose,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { getSkills } from "../services/api";

/* ==========================================================================
   1. CONFIGURATION DES ICONES
   Les textes viennent de l'API, les icones sont choisies avec ces tableaux.
========================================================================== */
const categoryIconMap = {
  code: FaCode,
  server: FaServer,
  tools: FaTools,
  users: FaUsers,
};

const itemIconMap = {
  api: FaPlug,
  bootstrap: FaBootstrap,
  check: FaCheckCircle,
  cicd: FaCodeBranch,
  code: FaCode,
  codex: FaRobot,
  comments: FaComments,
  css: FaCss3Alt,
  docker: FaDocker,
  express: SiExpress,
  figma: SiFigma,
  git: FaGitAlt,
  github: FaGithub,
  html: FaHtml5,
  javascript: FaJs,
  jwt: SiJsonwebtokens,
  lightbulb: FaLightbulb,
  mongodb: SiMongodb,
  mongoose: SiMongoose,
  node: FaNodeJs,
  react: FaReact,
  tailwind: SiTailwindcss,
  typescript: SiTypescript,
  users: FaUsers,
  "user-check": FaUserCheck,
};

/* ==========================================================================
   2. COMPOSANT PRINCIPAL : PAGE COMPETENCES
   Cette page charge les competences puis les affiche par categorie.
========================================================================== */
/* Skills affiche les compétences par groupes et les chiffres clés du parcours. */
function Skills() {
  const [skillsData, setSkillsData] = useState({ groups: [], stats: [] });
  const [status, setStatus] = useState("loading");

  /* --------------------------------------------------------------------------
     2.1 CHARGEMENT DES COMPETENCES DEPUIS L'API
     Le front appelle /api/skills puis stocke le resultat dans skillsData.
  -------------------------------------------------------------------------- */
  /* Charge les compétences depuis l'API ou depuis le JSON statique si le back-end est absent. */
  useEffect(() => {
    async function loadSkills() {
      try {
        const apiSkills = await getSkills();

        setSkillsData(apiSkills);
        setStatus("success");
      } catch (error) {
        console.error("Erreur pendant le chargement des compétences :", error);
        setStatus("error");
      }
    }

    loadSkills();
  }, []);

  /* --------------------------------------------------------------------------
     2.2 AFFICHAGE DE LA PAGE
     Selon status, on affiche le chargement, une erreur ou les donnees.
  -------------------------------------------------------------------------- */
  return (
    <main className="skills-page">
      {/* Introduction de la page compétences. */}
      <section className="skills-intro">
        <p className="section-label">COMPÉTENCES</p>
        <div className="section-line"></div>
        <h1>Mes compétences</h1>
        <p>
          Technologies utilisées en formation, en stage et dans des projets web
          concrets.
        </p>
      </section>

      {status === "loading" && (
        <p className="api-state">Chargement des compétences...</p>
      )}

      {status === "error" && (
        <p className="api-state">
          Les compétences ne sont pas disponibles pour le moment.
        </p>
      )}

      {/* Les groupes permettent de séparer front-end, back-end, outils et savoir-être. */}
      {status === "success" && (
        <>
          <section className="skills-grid">
            {skillsData.groups.map((group) => (
              <SkillCard key={group.title} {...group} />
            ))}
          </section>

          {/* Chiffres courts pour donner un aperçu rapide du parcours. */}
          <section className="stats-box">
            <p className="section-label">EXPÉRIENCE & RÉALISATIONS EN CHIFFRES</p>
            <div className="section-line"></div>

            <div className="stats-grid">
              {skillsData.stats.map((stat) => (
                <Stat key={stat.title} {...stat} />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

/* ==========================================================================
   3. COMPOSANTS REUTILISABLES
   Ces petits composants evitent de repeter le meme JSX plusieurs fois.
========================================================================== */
/* SkillCard choisit l'icône du groupe puis liste chaque compétence avec son icône. */
function SkillCard({ icon, title, color, description, items }) {
  const CategoryIcon = categoryIconMap[icon] || FaCode;

  return (
    <article className="skill-card">
      <div className="skill-head">
        <span className={`skill-icon ${color}`}>
          <CategoryIcon />
        </span>

        <div>
          <h2>{title}</h2>
          <div className={`skill-line ${color}`}></div>
          <p>{description}</p>
        </div>
      </div>

      <ul className="skill-list">
        {items.map(({ label, icon: itemIcon }) => {
          const ItemIcon = itemIconMap[itemIcon] || FaCode;

          return (
            <li key={label}>
              <ItemIcon className={`skill-item-icon ${color}`} />
              <span>{label}</span>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

/* Stat isole l'affichage d'un chiffre clé pour garder la page lisible. */
function Stat({ number, title, text }) {
  return (
    <article className="stat-item">
      <strong>{number}</strong>
      <p>{title}</p>
      <span>{text}</span>
    </article>
  );
}

export default Skills;
