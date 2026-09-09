const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const ADMIN_TOKEN_KEY = "portfolioAdminToken";

/* fetchJson centralise les lectures publiques et signale clairement les erreurs HTTP. */
async function fetchJson(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }

  return response.json();
}

/* fetchWithAuth ajoute le token JWT nécessaire aux routes protégées du back-office. */
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }

  return response.json();
}

/* Si aucun back-end n'est configuré, le front lit les fichiers JSON statiques de démonstration. */
export function getProjects() {
  return fetchJson(API_BASE_URL ? "/api/projects" : "/api/projects.json");
}

export function getSkills() {
  return fetchJson(API_BASE_URL ? "/api/skills" : "/api/skills.json");
}

export function getProfileCv() {
  return fetchJson(API_BASE_URL ? "/api/profile-cv" : "/api/profile-cv.json");
}

/* En mode statique, le contact reste testable grâce à un stockage local dans le navigateur. */
export async function sendContactMessage(messageData) {
  if (!API_BASE_URL) {
    const storedMessages = JSON.parse(
      localStorage.getItem("portfolioContactMessages") || "[]"
    );

    localStorage.setItem(
      "portfolioContactMessages",
      JSON.stringify([...storedMessages, { ...messageData, createdAt: new Date().toISOString() }])
    );

    return { success: true };
  }

  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(messageData),
  });

  if (!response.ok) {
    throw new Error("Impossible d'envoyer le message.");
  }

  return response.json();
}

/* L'API renvoie un JWT conservé côté navigateur pour les actions administrateur. */
export async function loginAdmin(credentials) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Connexion admin impossible.");
  }

  localStorage.setItem(ADMIN_TOKEN_KEY, data.token);

  return data.admin;
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function getCurrentAdmin() {
  return fetchWithAuth("/api/auth/me");
}

/* Projets admin : lecture, création, modification et suppression depuis le tableau de bord. */
export function getAdminProjects() {
  return fetchWithAuth("/api/admin/projects");
}

export function createAdminProject(projectData) {
  return fetchWithAuth("/api/admin/projects", {
    method: "POST",
    body: JSON.stringify(projectData),
  });
}

export function updateAdminProject(projectId, projectData) {
  return fetchWithAuth(`/api/admin/projects/${projectId}`, {
    method: "PUT",
    body: JSON.stringify(projectData),
  });
}

export function deleteAdminProject(projectId) {
  return fetchWithAuth(`/api/admin/projects/${projectId}`, {
    method: "DELETE",
  });
}

/* Compétences admin : les items sont envoyés à l'API puis regroupés côté serveur. */
export function getAdminSkills() {
  return fetchWithAuth("/api/admin/skills");
}

export function createAdminSkill(skillData) {
  return fetchWithAuth("/api/admin/skills", {
    method: "POST",
    body: JSON.stringify(skillData),
  });
}

export function updateAdminSkill(skillData) {
  return fetchWithAuth("/api/admin/skills", {
    method: "PUT",
    body: JSON.stringify(skillData),
  });
}

export function deleteAdminSkill(skillId) {
  return fetchWithAuth("/api/admin/skills", {
    method: "DELETE",
    body: JSON.stringify({ id: skillId }),
  });
}

/* Profil admin : un seul document MongoDB contient toutes les sections du CV public. */
export function getAdminProfile() {
  return fetchWithAuth("/api/admin/profile");
}

export function updateAdminProfile(profileData) {
  return fetchWithAuth("/api/admin/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
}

/* Messages de contact : lecture et suppression des demandes reçues depuis le formulaire public. */
export function getAdminMessages() {
  return fetchWithAuth("/api/admin/messages");
}

export function deleteAdminMessage(messageId) {
  return fetchWithAuth(`/api/admin/messages/${messageId}`, {
    method: "DELETE",
  });
}

/* Upload admin : envoie une image encodée en base64 pour créer une URL publique côté API. */
export function uploadAdminProjectImage(imageData) {
  return fetchWithAuth("/api/admin/uploads/images", {
    method: "POST",
    body: JSON.stringify(imageData),
  });
}
