import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaEnvelopeOpenText,
  FaFolderOpen,
  FaPlus,
  FaSave,
  FaSignOutAlt,
  FaTools,
  FaTrash,
  FaUserCog,
} from "react-icons/fa";
import {
  createAdminProject,
  createAdminSkill,
  deleteAdminMessage,
  deleteAdminProject,
  deleteAdminSkill,
  getAdminMessages,
  getAdminProfile,
  getAdminProjects,
  getAdminSkills,
  getCurrentAdmin,
  logoutAdmin,
  updateAdminProfile,
  updateAdminProject,
  updateAdminSkill,
  uploadAdminProjectImage,
} from "../services/api";

/* ==========================================================================
   1. VALEURS INITIALES DES FORMULAIRES
   Ces objets servent a initialiser ou vider les formulaires du dashboard.
========================================================================== */

const emptyProjectForm = {
  title: "",
  subtitle: "",
  description: "",
  shortDescription: "",
  image: "",
  tags: "",
  github: "",
  demo: "",
  featured: "false",
};

const emptySkillForm = {
  id: "",
  label: "",
  icon: "",
  groupTitle: "FRONT-END",
};

const groupOptions = ["FRONT-END", "BACK-END", "OUTILS & DEVOPS", "SOFT SKILLS"];

const emptyProfileForm = {
  name: "",
  title: "",
  summary: "",
  age: "",
  contacts: "",
  skills: "",
  softSkills: "",
  languages: "",
  hobbies: "",
  formations: "",
  experiences: "",
};

/* Convertit une liste API en texte multi-lignes pour l'édition dans un textarea. */
/* ==========================================================================
   2. OUTILS DE CONVERSION POUR LE PROFIL / CV
   MongoDB stocke des listes et objets, le formulaire admin affiche du texte.
========================================================================== */
function listToText(items = []) {
  return items.join("\n");
}

/* Transforme un textarea multi-lignes en tableau nettoyé avant l'envoi à l'API. */
function textToList(text) {
  return text
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

/* Sérialise les contacts avec un séparateur simple pour les rendre modifiables dans un champ texte. */
function contactsToText(contacts = []) {
  return contacts
    .map((contact) => `${contact.icon} | ${contact.label} | ${contact.href}`)
    .join("\n");
}

/* Reconstruit les objets contact attendus par le schéma ProfileCv. */
function textToContacts(text) {
  return textToList(text).map((line) => {
    const [icon = "", label = "", href = ""] = line.split("|").map((item) => item.trim());

    return { icon, label, href };
  });
}

/* Prépare les loisirs pour l'édition : une ligne contient l'icône et le libellé. */
function hobbiesToText(hobbies = []) {
  return hobbies.map((hobby) => `${hobby.icon} | ${hobby.label}`).join("\n");
}

/* Reconstruit les loisirs au format objet pour MongoDB. */
function textToHobbies(text) {
  return textToList(text).map((line) => {
    const [icon = "", label = ""] = line.split("|").map((item) => item.trim());

    return { icon, label };
  });
}

/* Prépare chaque formation sur une ligne lisible dans le formulaire admin. */
function formationsToText(formations = []) {
  return formations
    .map(
      (formation) =>
        `${formation.title} | ${formation.place} | ${formation.date} | ${formation.detail}`
    )
    .join("\n");
}

/* Reconstruit les formations structurées à partir du champ texte admin. */
function textToFormations(text) {
  return textToList(text).map((line) => {
    const [title = "", place = "", date = "", detail = ""] = line
      .split("|")
      .map((item) => item.trim());

    return { title, place, date, detail };
  });
}

/* Prépare les expériences, avec les missions séparées par des points-virgules. */
function experiencesToText(experiences = []) {
  return experiences
    .map(
      (experience) =>
        `${experience.title} | ${experience.company} | ${experience.date} | ${
          experience.place
        } | ${(experience.missions || []).join(" ; ")}`
    )
    .join("\n");
}

/* Reconstruit les expériences et leurs missions avant la sauvegarde API. */
function textToExperiences(text) {
  return textToList(text).map((line) => {
    const [title = "", company = "", date = "", place = "", missions = ""] = line
      .split("|")
      .map((item) => item.trim());

    return {
      title,
      company,
      date,
      place,
      missions: missions
        .split(";")
        .map((mission) => mission.trim())
        .filter(Boolean),
    };
  });
}

/* Crée l'état initial du formulaire CV à partir du document reçu de MongoDB. */
function createProfileForm(profile) {
  if (!profile) return emptyProfileForm;

  return {
    name: profile.hero?.name || "",
    title: profile.hero?.title || "",
    summary: profile.hero?.summary || "",
    age: profile.identity?.age || "",
    contacts: contactsToText(profile.identity?.contacts),
    skills: listToText(profile.skills),
    softSkills: listToText(profile.softSkills),
    languages: listToText(profile.languages),
    hobbies: hobbiesToText(profile.hobbies),
    formations: formationsToText(profile.formations),
    experiences: experiencesToText(profile.experiences),
  };
}

/* Recompose le payload ProfileCv attendu par le back-end depuis les champs du formulaire. */
function buildProfilePayload(form) {
  return {
    hero: {
      name: form.name,
      title: form.title,
      summary: form.summary,
    },
    identity: {
      age: form.age,
      contacts: textToContacts(form.contacts),
    },
    skills: textToList(form.skills),
    softSkills: textToList(form.softSkills),
    languages: textToList(form.languages),
    hobbies: textToHobbies(form.hobbies),
    formations: textToFormations(form.formations),
    experiences: textToExperiences(form.experiences),
  };
}

/* Lit une image locale en Data URL pour l'envoyer dans une requête JSON. */
/* ==========================================================================
   3. OUTILS TECHNIQUES DU DASHBOARD
   Lecture d'image locale et messages d'erreur lisibles.
========================================================================== */
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Lecture de l'image impossible."));
    reader.readAsDataURL(file);
  });
}

function getErrorMessage(error, fallbackMessage) {
  return error instanceof Error ? error.message : fallbackMessage;
}

/* AdminDashboard orchestre la session admin et les sections de gestion du portfolio. */
/* ==========================================================================
   4. COMPOSANT PRINCIPAL : TABLEAU DE BORD ADMIN
   Il verifie la session, charge les donnees et affiche la bonne section.
========================================================================== */
function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [authStatus, setAuthStatus] = useState("loading");
  const [activeSection, setActiveSection] = useState("projects");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");
  const [uploadStatus, setUploadStatus] = useState("");
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [profileForm, setProfileForm] = useState(emptyProfileForm);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [skillForm, setSkillForm] = useState(emptySkillForm);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingSkillId, setEditingSkillId] = useState(null);

  /* Vérification initiale : contrôle le token puis charge toutes les données admin en parallèle. */
  /* --------------------------------------------------------------------------
     4.1 SESSION ADMIN ET CHARGEMENT INITIAL
     Au chargement, on verifie le token puis on recupere les donnees admin.
  -------------------------------------------------------------------------- */
  useEffect(() => {
    async function verifyAdminSession() {
      try {
        const data = await getCurrentAdmin();
        const [apiProjects, apiSkills, apiProfile, apiMessages] = await Promise.all([
          getAdminProjects(),
          getAdminSkills(),
          getAdminProfile(),
          getAdminMessages(),
        ]);

        setAdmin(data.admin);
        setProjects(apiProjects);
        setSkills(apiSkills);
        setProfile(apiProfile);
        setMessages(apiMessages);
        setProfileForm(createProfileForm(apiProfile));
        setAuthStatus("success");
      } catch {
        logoutAdmin();
        navigate("/admin/login");
      }
    }

    verifyAdminSession();
  }, [navigate]);

  /* Déconnexion : supprime le token local puis revient à la page de login. */
  const logout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  /* Changement d'onglet : nettoie les messages pour éviter les retours visuels obsolètes. */
  /* --------------------------------------------------------------------------
     4.2 NAVIGATION ET MESSAGES DE RETOUR
     Ces fonctions changent d'onglet et affichent succes ou erreur.
  -------------------------------------------------------------------------- */
  const changeSection = (sectionKey) => {
    setActiveSection(sectionKey);
    setStatusMessage("");
    setStatusType("success");
    setUploadStatus("");
  };

  const showSuccess = (message) => {
    setStatusType("success");
    setStatusMessage(message);
  };

  const showError = (error, fallbackMessage) => {
    setStatusType("error");
    setStatusMessage(getErrorMessage(error, fallbackMessage));
  };

  /* Synchronise les champs du formulaire projet avec l'état local. */
  /* --------------------------------------------------------------------------
     4.3 PROJETS : SAISIE, UPLOAD, AJOUT ET MODIFICATION
     C'est la partie a montrer pour expliquer le CRUD projet cote front.
  -------------------------------------------------------------------------- */
  const handleProjectChange = (event) => {
    const { name, value } = event.target;

    setProjectForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  /* Upload d'image : convertit le fichier en base64 puis laisse l'API créer l'URL publique. */
  async function handleProjectImageUpload(file) {
    if (!file) return;

    setUploadStatus("Envoi de l'image en cours...");

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const uploadedImage = await uploadAdminProjectImage({
        fileName: file.name,
        mimeType: file.type,
        data: dataUrl,
      });

      setProjectForm((currentForm) => ({
        ...currentForm,
        image: uploadedImage.imageUrl,
      }));
      setUploadStatus("Image envoyee. Le champ Image a ete rempli.");
    } catch (error) {
      console.error("Erreur pendant l'upload de l'image :", error);
      setUploadStatus("L'image n'a pas pu etre envoyee.");
    }
  }

  /* Synchronise les champs du formulaire compétence. */
  /* --------------------------------------------------------------------------
     4.4 COMPETENCES : SAISIE, AJOUT ET MODIFICATION
  -------------------------------------------------------------------------- */
  const handleSkillChange = (event) => {
    const { name, value } = event.target;

    setSkillForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  /* Synchronise les champs du formulaire profil/CV. */
  /* --------------------------------------------------------------------------
     4.5 PROFIL / CV : SAISIE ET SAUVEGARDE
  -------------------------------------------------------------------------- */
  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));
  };

  /* Sauvegarde un projet : crée ou met à jour selon la présence d'un id en édition. */
  async function handleProjectSubmit(event) {
    /* Le submit est gere par React pour eviter un rechargement complet. */
    event.preventDefault();

    try {
      if (editingProjectId) {
        /* Si un id est en cours d'edition, on modifie le projet existant. */
        await updateAdminProject(editingProjectId, projectForm);
        showSuccess("Projet modifie avec succes.");
      } else {
        /* Sinon, on cree un nouveau projet dans MongoDB via l'API. */
        await createAdminProject(projectForm);
        showSuccess("Projet ajoute avec succes.");
      }

      /* Apres sauvegarde, on vide le formulaire et on recharge la liste. */
      setProjectForm(emptyProjectForm);
      setEditingProjectId(null);
      setProjects(await getAdminProjects());
    } catch (error) {
      showError(error, "Le projet n'a pas pu etre sauvegarde.");
    }
  }

  /* Sauvegarde une compétence : crée un nouvel item ou remplace l'item sélectionné. */
  async function handleSkillSubmit(event) {
    event.preventDefault();

    try {
      if (editingSkillId) {
        await updateAdminSkill({ ...skillForm, id: editingSkillId });
        showSuccess("Competence modifiee avec succes.");
      } else {
        await createAdminSkill(skillForm);
        showSuccess("Competence ajoutee avec succes.");
      }

      setSkillForm(emptySkillForm);
      setEditingSkillId(null);
      setSkills(await getAdminSkills());
    } catch (error) {
      showError(error, "La competence n'a pas pu etre sauvegardee.");
    }
  }

  /* Sauvegarde le profil : convertit le formulaire plat en document structuré pour l'API. */
  async function handleProfileSubmit(event) {
    event.preventDefault();

    try {
      const updatedProfile = await updateAdminProfile(buildProfilePayload(profileForm));

      setProfile(updatedProfile);
      setProfileForm(createProfileForm(updatedProfile));
      showSuccess("Profil modifie avec succes.");
    } catch (error) {
      showError(error, "Le profil n'a pas pu etre sauvegarde.");
    }
  }

  /* Remplit le formulaire projet avec les valeurs existantes pour passer en mode édition. */
  /* --------------------------------------------------------------------------
     4.6 EDITION ET SUPPRESSION DES ELEMENTS EXISTANTS
     Ces fonctions remplissent un formulaire ou demandent une suppression API.
  -------------------------------------------------------------------------- */
  const editProject = (project) => {
    /* On remet les valeurs du projet dans le formulaire pour les modifier. */
    setProjectForm({
      title: project.title || "",
      subtitle: project.subtitle || "",
      description: project.description || "",
      shortDescription: project.shortDescription || "",
      image: project.image || "",
      tags: project.tags?.join(", ") || "",
      github: project.github || "",
      demo: project.demo || "",
      featured: String(Boolean(project.featured)),
    });
    setEditingProjectId(project.id);
  };

  /* Remplit le formulaire compétence et conserve son identifiant composé. */
  const editSkill = (skill) => {
    setSkillForm({
      id: skill.id,
      label: skill.label,
      icon: skill.icon,
      groupTitle: skill.groupTitle,
    });
    setEditingSkillId(skill.id);
  };

  /* Supprime un projet puis recharge la liste admin pour garder l'interface à jour. */
  async function removeProject(projectId) {
    try {
      /* On envoie l'id au back pour supprimer le projet correspondant. */
      await deleteAdminProject(projectId);
      setProjects(await getAdminProjects());
      showSuccess("Projet supprime avec succes.");
    } catch (error) {
      showError(error, "Le projet n'a pas pu etre supprime.");
    }
  }

  /* Supprime une compétence dans son groupe puis recharge la liste aplatie. */
  async function removeSkill(skillId) {
    try {
      await deleteAdminSkill(skillId);
      setSkills(await getAdminSkills());
      showSuccess("Competence supprimee avec succes.");
    } catch (error) {
      showError(error, "La competence n'a pas pu etre supprimee.");
    }
  }

  /* Supprime un message après confirmation utilisateur pour éviter une action accidentelle. */
  async function removeMessage(messageId) {
    const confirmed = window.confirm("Supprimer ce message de contact ?");

    if (!confirmed) return;

    try {
      await deleteAdminMessage(messageId);
      setMessages(await getAdminMessages());
      showSuccess("Message supprime avec succes.");
    } catch (error) {
      showError(error, "Le message n'a pas pu etre supprime.");
    }
  }

  /* --------------------------------------------------------------------------
     4.7 AFFICHAGE DU DASHBOARD
     Selon activeSection, React affiche Projets, Competences, Profil ou Messages.
  -------------------------------------------------------------------------- */
  if (authStatus === "loading") {
    return (
      <main className="admin-page">
        <p className="api-state">Vérification de la session admin...</p>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div>
          <p className="section-label">ADMINISTRATION</p>
          <h1>Tableau de bord</h1>
          <p>
            Gérez les projets, les compétences et le profil depuis MongoDB.
          </p>
          {admin && (
            <span className="admin-connected">Connecté : {admin.email}</span>
          )}
        </div>

        <button type="button" onClick={logout}>
          <FaSignOutAlt />
          Déconnexion
        </button>
      </section>

      <section className="admin-layout">
        <aside className="admin-menu">
          <button
            type="button"
            className={activeSection === "projects" ? "active" : ""}
            onClick={() => changeSection("projects")}
          >
            <FaFolderOpen />
            Projets
          </button>
          <button
            type="button"
            className={activeSection === "skills" ? "active" : ""}
            onClick={() => changeSection("skills")}
          >
            <FaTools />
            Compétences
          </button>
          <button
            type="button"
            className={activeSection === "profile" ? "active" : ""}
            onClick={() => changeSection("profile")}
          >
            <FaUserCog />
            Profil
          </button>
          <button
            type="button"
            className={activeSection === "messages" ? "active" : ""}
            onClick={() => changeSection("messages")}
          >
            <FaEnvelopeOpenText />
            Messages
          </button>
        </aside>

        <section className="admin-panel">
          {statusMessage && (
            <p className={`form-status ${statusType}`}>{statusMessage}</p>
          )}

          {activeSection === "projects" && (
            <ProjectAdmin
              form={projectForm}
              projects={projects}
              editingId={editingProjectId}
              uploadStatus={uploadStatus}
              onChange={handleProjectChange}
              onImageUpload={handleProjectImageUpload}
              onSubmit={handleProjectSubmit}
              onEdit={editProject}
              onDelete={removeProject}
            />
          )}

          {activeSection === "skills" && (
            <SkillAdmin
              form={skillForm}
              skills={skills}
              editingId={editingSkillId}
              onChange={handleSkillChange}
              onSubmit={handleSkillSubmit}
              onEdit={editSkill}
              onDelete={removeSkill}
            />
          )}

          {activeSection === "profile" && profile && (
            <ProfileEditor
              form={profileForm}
              onChange={handleProfileChange}
              onSubmit={handleProfileSubmit}
            />
          )}

          {activeSection === "messages" && (
            <MessagesAdmin messages={messages} onDelete={removeMessage} />
          )}
        </section>
      </section>
    </main>
  );
}

/* ProjectAdmin contient le formulaire projet et la liste des projets existants. */
/* ==========================================================================
   5. SECTION PROJETS
   Formulaire d'ajout/modification + liste des projets existants.
========================================================================== */
function ProjectAdmin({
  form,
  projects,
  editingId,
  uploadStatus,
  onChange,
  onImageUpload,
  onSubmit,
  onEdit,
  onDelete,
}) {
  return (
    <>
      <h2>Projets</h2>
      <form className="admin-form" onSubmit={onSubmit}>
        <label>
          Titre
          <input name="title" value={form.title} onChange={onChange} required />
        </label>
        <label>
          Sous-titre
          <input name="subtitle" value={form.subtitle} onChange={onChange} required />
        </label>
        <label>
          Description complète
          <input name="description" value={form.description} onChange={onChange} required />
        </label>
        <label>
          Description courte
          <input
            name="shortDescription"
            value={form.shortDescription}
            onChange={onChange}
            required
          />
        </label>
        <label>
          Image
          <input name="image" value={form.image} onChange={onChange} required />
        </label>
        <label>
          Importer une image
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(event) => {
              onImageUpload(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <small>Formats acceptes : JPG, PNG, WebP, GIF. Taille maximale : 3 Mo.</small>
        </label>
        {uploadStatus && <p className="admin-upload-status">{uploadStatus}</p>}
        <label>
          Technologies
          <input name="tags" value={form.tags} onChange={onChange} required />
        </label>
        <label>
          GitHub
          <input name="github" value={form.github} onChange={onChange} required />
        </label>
        <label>
          Démo
          <input name="demo" value={form.demo} onChange={onChange} required />
        </label>
        <label>
          Mis en avant
          <select name="featured" value={form.featured} onChange={onChange}>
            <option value="false">Non</option>
            <option value="true">Oui</option>
          </select>
        </label>

        <button type="submit">
          {editingId ? <FaSave /> : <FaPlus />}
          {editingId ? "Enregistrer" : "Ajouter"}
        </button>
      </form>

      <div className="admin-list">
        {projects.map((project) => (
          <article key={project.id} className="admin-item">
            <div>
              <h3>{project.title}</h3>
              <p>{project.shortDescription}</p>
            </div>

            <AdminActions item={project} onEdit={onEdit} onDelete={onDelete} />
          </article>
        ))}
      </div>
    </>
  );
}

/* SkillAdmin gère les compétences une par une, même si l'API les stocke par groupes. */
/* ==========================================================================
   6. SECTION COMPETENCES
   Formulaire d'ajout/modification + liste des competences existantes.
========================================================================== */
function SkillAdmin({
  form,
  skills,
  editingId,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
}) {
  return (
    <>
      <h2>Compétences</h2>
      <form className="admin-form" onSubmit={onSubmit}>
        <label>
          Nom
          <input name="label" value={form.label} onChange={onChange} required />
        </label>
        <label>
          Icône
          <input name="icon" value={form.icon} onChange={onChange} required />
        </label>
        <label>
          Groupe
          <select name="groupTitle" value={form.groupTitle} onChange={onChange}>
            {groupOptions.map((group) => (
              <option key={group}>{group}</option>
            ))}
          </select>
        </label>

        <button type="submit">
          {editingId ? <FaSave /> : <FaPlus />}
          {editingId ? "Enregistrer" : "Ajouter"}
        </button>
      </form>

      <div className="admin-list">
        {skills.map((skill) => (
          <article key={skill.id} className="admin-item">
            <div>
              <h3>{skill.label}</h3>
              <p>
                {skill.groupTitle} - icône : {skill.icon}
              </p>
            </div>

            <AdminActions item={skill} onEdit={onEdit} onDelete={onDelete} />
          </article>
        ))}
      </div>
    </>
  );
}

/* ProfileEditor édite toutes les sections du CV dans un formulaire unique. */
/* ==========================================================================
   7. SECTION PROFIL / CV
   Formulaire qui modifie le contenu dynamique de la page CV.
========================================================================== */
function ProfileEditor({ form, onChange, onSubmit }) {
  return (
    <>
      <h2>Profil et CV complet</h2>
      <form className="admin-form profile-form" onSubmit={onSubmit}>
        <label>
          Nom
          <input name="name" value={form.name} onChange={onChange} required />
        </label>
        <label>
          Titre professionnel
          <input name="title" value={form.title} onChange={onChange} required />
        </label>
        <label>
          Résumé
          <textarea name="summary" value={form.summary} onChange={onChange} required />
        </label>
        <label>
          Age
          <input name="age" value={form.age} onChange={onChange} required />
        </label>
        <label className="full-width">
          Contacts complets
          <textarea name="contacts" value={form.contacts} onChange={onChange} required />
          <small>Une ligne par contact : icone | libelle | lien</small>
        </label>

        <label>
          Competences techniques
          <textarea name="skills" value={form.skills} onChange={onChange} required />
          <small>Une competence par ligne.</small>
        </label>

        <label>
          Savoir-etre
          <textarea name="softSkills" value={form.softSkills} onChange={onChange} required />
          <small>Un savoir-etre par ligne.</small>
        </label>

        <label>
          Langues
          <textarea name="languages" value={form.languages} onChange={onChange} required />
          <small>Une langue par ligne.</small>
        </label>

        <label>
          Loisirs
          <textarea name="hobbies" value={form.hobbies} onChange={onChange} required />
          <small>Une ligne par loisir : icone | libelle</small>
        </label>

        <label className="full-width">
          Parcours academique
          <textarea name="formations" value={form.formations} onChange={onChange} required />
          <small>Une ligne par formation : titre | lieu | date | detail</small>
        </label>

        <label className="full-width">
          Experiences professionnelles
          <textarea name="experiences" value={form.experiences} onChange={onChange} required />
          <small>
            Une ligne par experience : titre | entreprise | date | lieu | mission 1 ; mission 2
          </small>
        </label>

        <button type="submit">
          <FaSave />
          Enregistrer le CV
        </button>
      </form>
    </>
  );
}

/* MessagesAdmin liste les messages de contact et permet leur suppression. */
/* ==========================================================================
   8. SECTION MESSAGES DE CONTACT
   Liste les messages stockes dans MongoDB et permet leur suppression.
========================================================================== */
function MessagesAdmin({ messages, onDelete }) {
  return (
    <>
      <h2>Messages contact</h2>
      <p className="admin-section-text">
        Consultez les messages envoyes depuis le formulaire de contact.
      </p>

      {messages.length === 0 ? (
        <p className="api-state">Aucun message pour le moment.</p>
      ) : (
        <div className="admin-list">
          {messages.map((message) => (
            <article key={message.id} className="admin-item admin-message">
              <div>
                <div className="admin-message-header">
                  <h3>{message.subject}</h3>
                  <span>{formatMessageDate(message.createdAt)}</span>
                </div>
                <p>
                  {message.name} -{" "}
                  <a href={`mailto:${message.email}`}>{message.email}</a>
                </p>
                <p>{message.message}</p>
              </div>

              <div className="admin-item-actions">
                <button type="button" onClick={() => onDelete(message.id)}>
                  <FaTrash />
                  Supprimer
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

/* Formate les dates MongoDB en affichage français pour le tableau admin. */
/* ==========================================================================
   9. PETITS COMPOSANTS REUTILISABLES
   Fonctions d'affichage utilisees par plusieurs sections.
========================================================================== */
function formatMessageDate(dateValue) {
  if (!dateValue) return "Date inconnue";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

/* AdminActions factorise les boutons modifier/supprimer des listes admin. */
function AdminActions({ item, onEdit, onDelete }) {
  return (
    <div className="admin-item-actions">
      <button type="button" onClick={() => onEdit(item)}>
        <FaEdit />
        Modifier
      </button>
      <button type="button" onClick={() => onDelete(item.id)}>
        <FaTrash />
        Supprimer
      </button>
    </div>
  );
}

export default AdminDashboard;
