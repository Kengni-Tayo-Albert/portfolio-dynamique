import { useState } from "react";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhoneAlt,
} from "react-icons/fa";
import { sendContactMessage } from "../services/api";

/* ==========================================================================
   1. DONNEES FIXES DU FORMULAIRE ET DES COORDONNEES
   initialForm initialise les champs, contactItems alimente les cartes contact.
========================================================================== */
const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const contactItems = [
  {
    icon: FaEnvelope,
    title: "Email",
    text: "kengnitayojunior@gmail.com",
    href: "mailto:kengnitayojunior@gmail.com",
  },
  {
    icon: FaPhoneAlt,
    title: "Téléphone",
    text: "+33 6 41 84 89 50",
    href: "tel:+33641848950",
  },
  {
    icon: FaMapMarkerAlt,
    title: "Localisation",
    text: "Pau, Nouvelle-Aquitaine",
    href: "https://www.google.com/maps/place/Pau",
  },
];

/* ==========================================================================
   2. COMPOSANT PRINCIPAL : PAGE CONTACT
   Cette page affiche les coordonnees et envoie les messages vers l'API.
========================================================================== */
/* Contact regroupe les coordonnées et le formulaire relié à l'API de messages. */
function Contact() {
  const [formData, setFormData] = useState(initialForm);
  const [formStatus, setFormStatus] = useState(null);

  /* --------------------------------------------------------------------------
     2.1 SAISIE DU FORMULAIRE
     A chaque frappe, React garde la valeur du champ dans formData.
  -------------------------------------------------------------------------- */
  /* Synchronise chaque champ du formulaire avec l'état React. */
  const handleChange = (event) => {
    /* name vaut "email", "subject", etc. value est ce que tape le visiteur. */
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  /* --------------------------------------------------------------------------
     2.2 ENVOI DU MESSAGE
     On valide cote front, puis api.js envoie la requete POST au back-end.
  -------------------------------------------------------------------------- */
  /* Valide les champs avant d'envoyer le message au service API. */
  const handleSubmit = async (event) => {
    /* preventDefault empeche le rechargement de la page au submit. */
    event.preventDefault();

    const errorMessage = validateContactForm(formData);

    if (errorMessage) {
      setFormStatus({ type: "error", message: errorMessage });
      return;
    }

    try {
      /* sendContactMessage envoie les donnees vers POST /api/contact. */
      await sendContactMessage(formData);
      setFormStatus({
        type: "success",
        message: "Votre message a bien été enregistré dans la base de données.",
      });
      setFormData(initialForm);
    } catch {
      setFormStatus({
        type: "error",
        message: "Une erreur est survenue. Merci de réessayer plus tard.",
      });
    }
  };

  /* --------------------------------------------------------------------------
     2.3 AFFICHAGE DE LA PAGE
     Le JSX separe les coordonnees a gauche et le formulaire a droite.
  -------------------------------------------------------------------------- */
  return (
    <main className="contact-page">
      {/* Introduction courte de la page contact. */}
      <section className="contact-intro">
        <p className="section-label">CONTACT</p>
        <h1>Travaillons ensemble</h1>
        <p>
          Une alternance, une collaboration ou un projet web ? Vous pouvez me
          contacter directement avec les informations ci-dessous.
        </p>
        <div className="section-line"></div>
      </section>

      {/* Colonne de coordonnées et formulaire de prise de contact. */}
      <section className="contact-container">
        <aside className="contact-info">
          <h2>Mes coordonnées</h2>
          <p>
            Je suis disponible pour échanger autour d'une alternance, d'un projet
            web ou d'une opportunité professionnelle.
          </p>

          {contactItems.map((item) => (
            <ContactItem key={item.title} {...item} />
          ))}

          <h3>Réseaux professionnels</h3>

          <div className="contact-socials">
            <a
              href="https://www.linkedin.com/in/albert-tayo/?skipRedirect=true"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin />
              LinkedIn
            </a>
            <a
              href="https://github.com/Kengni-Tayo-Albert"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub />
              GitHub
            </a>
          </div>
        </aside>

        <form className="contact-form" onSubmit={handleSubmit}>
          {/* Le formulaire crée un message consultable depuis l'administration. */}
          <h2>Envoyer un message</h2>
          <p>
            Présentez rapidement votre besoin, je pourrai vous répondre plus
            facilement.
          </p>

          <div className="form-row">
            <label>
              Nom complet
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom"
              />
            </label>

            <label>
              Adresse email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre.email@gmail.com"
              />
            </label>
          </div>

          <label>
            Sujet
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            >
              <option value="" disabled>
                Choisir un sujet
              </option>
              <option>Alternance</option>
              <option>Collaboration</option>
              <option>Projet web</option>
              <option>Autre demande</option>
            </select>
          </label>

          <label>
            Message
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Bonjour Albert, je vous contacte pour..."
            />
          </label>

          {formStatus && (
            <p className={`form-status ${formStatus.type}`}>
              {formStatus.message}
            </p>
          )}

          <div className="contact-actions">
            <button type="submit">
              <FaPaperPlane />
              Envoyer le message
            </button>
            <a href="tel:+33641848950">
              <FaPhoneAlt />
              Appeler
            </a>
          </div>
        </form>
      </section>
    </main>
  );
}

/* ==========================================================================
   3. VALIDATION FRONT DU FORMULAIRE
   C'est une premiere verification avant la validation serveur obligatoire.
========================================================================== */
/* Validation front : bloque les champs vides, emails invalides et messages trop courts. */
function validateContactForm({ name, email, subject, message }) {
  /* Premiere securite cote front : eviter l'envoi d'un formulaire vide. */
  if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
    return "Merci de remplir tous les champs du formulaire.";
  }

  /* Verification simple du format email avant l'appel API. */
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Merci de saisir une adresse email valide.";
  }

  if (message.trim().length < 10) {
    return "Votre message doit contenir au moins 10 caractères.";
  }

  return null;
}

/* ==========================================================================
   4. COMPOSANT REUTILISABLE : CARTE DE CONTACT
   Chaque coordonnee utilise le meme affichage et gere les liens externes.
========================================================================== */
/* ContactItem affiche une coordonnée cliquable et gère les liens externes proprement. */
function ContactItem({ icon: Icon, title, text, href }) {
  const isExternalLink = href.startsWith("http");

  return (
    <a
      className="contact-item"
      href={href}
      target={isExternalLink ? "_blank" : undefined}
      rel={isExternalLink ? "noreferrer" : undefined}
    >
      <span>
        <Icon />
      </span>

      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </a>
  );
}

export default Contact;
