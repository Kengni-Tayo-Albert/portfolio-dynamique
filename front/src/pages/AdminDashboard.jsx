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

function listToText(items = []) {
  return items.join("\n");
}

function textToList(text) {
  return text
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function contactsToText(contacts = []) {
  return contacts
    .map((contact) => `${contact.icon} | ${contact.label} | ${contact.href}`)
    .join("\n");
}

function textToContacts(text) {
  return textToList(text).map((line) => {
    const [icon = "", label = "", href = ""] = line.split("|").map((item) => item.trim());

    return { icon, label, href };
  });
}

function hobbiesToText(hobbies = []) {
  return hobbies.map((hobby) => `${hobby.icon} | ${hobby.label}`).join("\n");
}

function textToHobbies(text) {
  return textToList(text).map((line) => {
    const [icon = "", label = ""] = line.split("|").map((item) => item.trim());

    return { icon, label };
  });
}

function formationsToText(formations = []) {
  return formations
    .map(
      (formation) =>
        `${formation.title} | ${formation.place} | ${formation.date} | ${formation.detail}`
    )
    .join("\n");
}

function textToFormations(text) {
  return textToList(text).map((line) => {
    const [title = "", place = "", date = "", detail = ""] = line
      .split("|")
      .map((item) => item.trim());

    return { title, place, date, detail };
  });
}

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

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Lecture de l'image impossible."));
    reader.readAsDataURL(file);
  });
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [authStatus, setAuthStatus] = useState("loading");
  const [activeSection, setActiveSection] = useState("projects");
  const [statusMessage, setStatusMessage] = useState("");
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

  const logout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  const changeSection = (sectionKey) => {
    setActiveSection(sectionKey);
    setStatusMessage("");
    setUploadStatus("");
  };

  const handleProjectChange = (event) => {
    const { name, value } = event.target;

    setProjectForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

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

  const handleSkillChange = (event) => {
    const { name, value } = event.target;

    setSkillForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));
  };

  async function handleProjectSubmit(event) {
    event.preventDefault();

    if (editingProjectId) {
      await updateAdminProject(editingProjectId, projectForm);
      setStatusMessage("Projet modifié avec succès.");
    } else {
      await createAdminProject(projectForm);
      setStatusMessage("Projet ajouté avec succès.");
    }

    setProjectForm(emptyProjectForm);
    setEditingProjectId(null);
    setProjects(await getAdminProjects());
  }

  async function handleSkillSubmit(event) {
    event.preventDefault();

    if (editingSkillId) {
      await updateAdminSkill({ ...skillForm, id: editingSkillId });
      setStatusMessage("Compétence modifiée avec succès.");
    } else {
      await createAdminSkill(skillForm);
      setStatusMessage("Compétence ajoutée avec succès.");
    }

    setSkillForm(emptySkillForm);
    setEditingSkillId(null);
    setSkills(await getAdminSkills());
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();

    const updatedProfile = await updateAdminProfile(buildProfilePayload(profileForm));

    setProfile(updatedProfile);
    setProfileForm(createProfileForm(updatedProfile));
    setStatusMessage("Profil modifié avec succès.");
  }

  const editProject = (project) => {
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

  const editSkill = (skill) => {
    setSkillForm({
      id: skill.id,
      label: skill.label,
      icon: skill.icon,
      groupTitle: skill.groupTitle,
    });
    setEditingSkillId(skill.id);
  };

  async function removeProject(projectId) {
    await deleteAdminProject(projectId);
    setProjects(await getAdminProjects());
    setStatusMessage("Projet supprimé avec succès.");
  }

  async function removeSkill(skillId) {
    await deleteAdminSkill(skillId);
    setSkills(await getAdminSkills());
    setStatusMessage("Compétence supprimée avec succès.");
  }

  async function removeMessage(messageId) {
    const confirmed = window.confirm("Supprimer ce message de contact ?");

    if (!confirmed) return;

    await deleteAdminMessage(messageId);
    setMessages(await getAdminMessages());
    setStatusMessage("Message supprime avec succes.");
  }

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
            <p className="form-status success">{statusMessage}</p>
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
          Âge
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
