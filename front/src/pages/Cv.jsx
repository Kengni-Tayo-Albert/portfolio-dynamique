import { useEffect, useState } from "react";
import {
  FaBasketballBall,
  FaBookOpen,
  FaBriefcase,
  FaEnvelope,
  FaGithub,
  FaGlobeEurope,
  FaGraduationCap,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRunning,
  FaTools,
  FaUser,
} from "react-icons/fa";
import { getProfileCv } from "../services/api";

/* Reglages simples du CV : fichier PDF et icones. */
const cvPdfPath = "/cv-albert-tayo.pdf";
const cvPdfFileName = "CV-Albert-Tayo.pdf";

const contactIconMap = {
  email: FaEnvelope,
  github: FaGithub,
  linkedin: FaLinkedin,
  location: FaMapMarkerAlt,
  phone: FaPhoneAlt,
};

const hobbyIconMap = {
  basketball: FaBasketballBall,
  book: FaBookOpen,
  running: FaRunning,
};

function removeDashSeparator(text) {
  return String(text).replace(/\s+-\s+/g, " ");
}

/* Page CV : les donnees viennent de l'API puis sont affichees en blocs. */
function Cv() {
  const [cvData, setCvData] = useState(null);
  const [status, setStatus] = useState("loading");

  /* Chargement du profil CV. */
  useEffect(() => {
    async function loadProfileCv() {
      try {
        const apiProfile = await getProfileCv();

        setCvData(apiProfile);
        setStatus("success");
      } catch (error) {
        console.error("Erreur pendant le chargement du CV :", error);
        setStatus("error");
      }
    }

    loadProfileCv();
  }, []);

  /* Ecrans simples pendant le chargement ou en cas d'erreur. */
  if (status === "loading") {
    return (
      <main className="cv-page">
        <p className="api-state">Chargement du CV...</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="cv-page">
        <p className="api-state">Le CV n'est pas disponible pour le moment.</p>
      </main>
    );
  }

  /* Affichage du CV quand les donnees sont disponibles. */
  return (
    <main className="cv-page">
      {/* Résumé de l'identité professionnelle avec téléchargement du CV PDF. */}
      <section className="cv-hero">
        <p className="section-label">CV EN LIGNE</p>
        <h1>{cvData.hero.name}</h1>
        <h2>{cvData.hero.title}</h2>
        <p>{cvData.hero.summary}</p>
        {/* Le PDF est dans front/public, donc Vite le rend accessible avec ce chemin. */}
        <a href={cvPdfPath} download={cvPdfFileName}>
          Télécharger le CV PDF
        </a>
      </section>

      <section className="cv-layout">
        {/* Informations rapides utiles pour lire le profil en un coup d'oeil. */}
        <aside className="cv-sidebar">
          <CvBlock icon={FaUser} title="Identité & contact">
            <p>{cvData.identity.age}</p>
            <div className="cv-contact-list">
              {cvData.identity.contacts.map(({ icon, label, href }) => {
                const Icon = contactIconMap[icon] || FaUser;
                const isExternalLink = href.startsWith("http");

                return (
                  <a
                    key={label}
                    href={href}
                    target={isExternalLink ? "_blank" : undefined}
                    rel={isExternalLink ? "noreferrer" : undefined}
                  >
                    <Icon />
                    <span>{label}</span>
                  </a>
                );
              })}
            </div>
          </CvBlock>

          <CvBlock icon={FaTools} title="Compétences">
            <div className="cv-tags">
              {cvData.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </CvBlock>

          <CvBlock icon={FaUser} title="Savoir-être">
            <ul className="cv-simple-list">
              {cvData.softSkills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </CvBlock>

          <CvBlock icon={FaGlobeEurope} title="Langues">
            <ul className="cv-simple-list">
              {cvData.languages.map((language) => (
                <li key={language}>{removeDashSeparator(language)}</li>
              ))}
            </ul>
          </CvBlock>

          <CvBlock icon={FaBasketballBall} title="Loisirs">
            <ul className="cv-hobbies">
              {cvData.hobbies.map(({ icon, label }) => {
                const Icon = hobbyIconMap[icon] || FaBookOpen;

                return (
                  <li key={label}>
                    <Icon />
                    <span>{removeDashSeparator(label)}</span>
                  </li>
                );
              })}
            </ul>
          </CvBlock>
        </aside>

        {/* Parcours académique et expériences affichés sous forme de timeline. */}
        <section className="cv-main">
          <CvSection icon={FaGraduationCap} title="Parcours académique">
            {cvData.formations.map((formation) => (
              <TimelineCard key={formation.title} {...formation} />
            ))}
          </CvSection>

          <CvSection icon={FaBriefcase} title="Expériences professionnelles">
            {cvData.experiences.map((experience) => (
              <ExperienceCard key={experience.title} {...experience} />
            ))}
          </CvSection>
        </section>
      </section>
    </main>
  );
}

/* Composants reutilisables pour les blocs du CV. */
function CvBlock({ icon: Icon, title, children }) {
  return (
    <article className="cv-block">
      <h3>
        <Icon />
        {title}
      </h3>
      {children}
    </article>
  );
}

/* CvSection garde le même style pour les grandes parties du CV. */
function CvSection({ icon: Icon, title, children }) {
  return (
    <section className="cv-section">
      <h2>
        <Icon />
        {title}
      </h2>
      {children}
    </section>
  );
}

/* TimelineCard représente une formation avec lieu, période et détail. */
function TimelineCard({ title, place, date, detail }) {
  return (
    <article className="cv-timeline-card">
      <div>
        <h3>{removeDashSeparator(title)}</h3>
        <p>{place}</p>
      </div>
      <span>{removeDashSeparator(date)}</span>
      <p>{detail}</p>
    </article>
  );
}

/* ExperienceCard affiche une expérience et ses missions sous forme de liste. */
function ExperienceCard({ title, company, date, place, missions }) {
  return (
    <article className="cv-timeline-card">
      <div>
        <h3>{removeDashSeparator(title)}</h3>
        <p>{company} {place}</p>
      </div>
      <span>{removeDashSeparator(date)}</span>
      <ul>
        {missions.map((mission) => (
          <li key={mission}>{removeDashSeparator(mission)}</li>
        ))}
      </ul>
    </article>
  );
}

export default Cv;
