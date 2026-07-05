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

function Skills() {
  const [skillsData, setSkillsData] = useState({ groups: [], stats: [] });
  const [status, setStatus] = useState("loading");

  /* EFFECT - Récupération API des compétences */
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

  return (
    <main className="skills-page">
      {/* HEADER SECTION - Titre principal de la page compétences */}
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

      {/* SKILLS GRID - Catégories principales de compétences */}
      {status === "success" && (
        <>
          <section className="skills-grid">
            {skillsData.groups.map((group) => (
              <SkillCard key={group.title} {...group} />
            ))}
          </section>

          {/* STATS SECTION - Chiffres clés */}
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

/* COMPONENT - Carte de compétence réutilisable */
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

/* COMPONENT - Statistique réutilisable */
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
