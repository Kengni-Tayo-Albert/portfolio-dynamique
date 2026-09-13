import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelopeOpenText,
  FaFolderOpen,
  FaSignOutAlt,
  FaTools,
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
import MessagesAdminSection from "./admin/MessagesAdminSection";
import ProfileAdminSection from "./admin/ProfileAdminSection";
import ProjectAdminSection from "./admin/ProjectAdminSection";
import SkillAdminSection from "./admin/SkillAdminSection";
import {
  buildProfilePayload,
  createProfileForm,
  emptyProjectForm,
  emptySkillForm,
  getErrorMessage,
  readFileAsDataUrl,
} from "./admin/adminFormHelpers";

/* Repere : ce fichier garde la logique du dashboard admin.
   Les formulaires visibles sont ranges dans front/src/pages/admin. */
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

  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [skillForm, setSkillForm] = useState(emptySkillForm);
  const [profileForm, setProfileForm] = useState(createProfileForm(null));
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingSkillId, setEditingSkillId] = useState(null);

  /* Au chargement de la page, je verifie la session admin puis je charge les donnees. */
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

  /* Navigation entre les onglets et messages de retour. */
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

  const logout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  /* Mise a jour des formulaires React. */
  const updateProjectForm = (event) => {
    const { name, value } = event.target;
    setProjectForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const updateSkillForm = (event) => {
    const { name, value } = event.target;
    setSkillForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const updateProfileForm = (event) => {
    const { name, value } = event.target;
    setProfileForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  async function uploadProjectImage(file) {
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

  /* Actions projet : ajouter, modifier, supprimer. */
  async function saveProject(event) {
    event.preventDefault();

    try {
      if (editingProjectId) {
        await updateAdminProject(editingProjectId, projectForm);
        showSuccess("Projet modifie avec succes.");
      } else {
        await createAdminProject(projectForm);
        showSuccess("Projet ajoute avec succes.");
      }

      setProjectForm(emptyProjectForm);
      setEditingProjectId(null);
      setProjects(await getAdminProjects());
    } catch (error) {
      showError(error, "Le projet n'a pas pu etre sauvegarde.");
    }
  }

  function editProject(project) {
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
  }

  async function removeProject(projectId) {
    try {
      await deleteAdminProject(projectId);
      setProjects(await getAdminProjects());
      showSuccess("Projet supprime avec succes.");
    } catch (error) {
      showError(error, "Le projet n'a pas pu etre supprime.");
    }
  }

  /* Actions competences : ajouter, modifier, supprimer. */
  async function saveSkill(event) {
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

  function editSkill(skill) {
    setSkillForm({
      id: skill.id,
      label: skill.label,
      icon: skill.icon,
      groupTitle: skill.groupTitle,
    });
    setEditingSkillId(skill.id);
  }

  async function removeSkill(skillId) {
    try {
      await deleteAdminSkill(skillId);
      setSkills(await getAdminSkills());
      showSuccess("Competence supprimee avec succes.");
    } catch (error) {
      showError(error, "La competence n'a pas pu etre supprimee.");
    }
  }

  /* Actions profil/CV et messages de contact. */
  async function saveProfile(event) {
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

  /* Affichage : l'onglet actif choisit le composant a montrer. */
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
          <p>Gérez les projets, les compétences et le profil depuis MongoDB.</p>
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
            <ProjectAdminSection
              form={projectForm}
              projects={projects}
              editingId={editingProjectId}
              uploadStatus={uploadStatus}
              onChange={updateProjectForm}
              onImageUpload={uploadProjectImage}
              onSubmit={saveProject}
              onEdit={editProject}
              onDelete={removeProject}
            />
          )}

          {activeSection === "skills" && (
            <SkillAdminSection
              form={skillForm}
              skills={skills}
              editingId={editingSkillId}
              onChange={updateSkillForm}
              onSubmit={saveSkill}
              onEdit={editSkill}
              onDelete={removeSkill}
            />
          )}

          {activeSection === "profile" && profile && (
            <ProfileAdminSection
              form={profileForm}
              onChange={updateProfileForm}
              onSubmit={saveProfile}
            />
          )}

          {activeSection === "messages" && (
            <MessagesAdminSection messages={messages} onDelete={removeMessage} />
          )}
        </section>
      </section>
    </main>
  );
}

export default AdminDashboard;
