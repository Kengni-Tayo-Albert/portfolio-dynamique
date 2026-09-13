const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const ADMIN_TOKEN_KEY = "portfolioAdminToken";

/* Le token admin est garde dans le navigateur apres la connexion. */
function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

/* Sert a savoir si on peut tenter d'ouvrir le dashboard admin. */
export function hasAdminToken() {
  return Boolean(getAdminToken());
}

async function readApiResponse(response, fallbackMessage) {
  /* Certaines erreurs n'ont pas de body JSON, donc on protege la lecture. */
  const data = await response.json().catch(() => null);

  /* response.ok vaut false pour les statuts 400, 401, 403, 500, etc. */
  if (!response.ok) {
    throw new Error(data?.message || fallbackMessage || `Erreur API : ${response.status}`);
  }

  return data;
}

/* Lecture publique : projets, competences et CV. */
async function fetchJson(endpoint) {
  /* fetch envoie une requete HTTP au back-end ou au fichier JSON statique. */
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  return readApiResponse(response, "Donnees indisponibles.");
}

/* Routes admin : le JWT est ajoute dans l'en-tete Authorization. */
async function fetchWithAuth(endpoint, options = {}) {
  const token = getAdminToken();

  /* Sans token, on bloque deja l'action cote front. Le back verifiera aussi. */
  if (!token) {
    throw new Error("Session admin absente.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      /* Format attendu par le back : Authorization: Bearer <token>. */
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  return readApiResponse(response, "Action admin impossible.");
}

/* Sans URL de back-end, le site public lit les JSON statiques de demonstration. */
export function getProjects() {
  return fetchJson(API_BASE_URL ? "/api/projects" : "/api/projects.json");
}

export function getSkills() {
  return fetchJson(API_BASE_URL ? "/api/skills" : "/api/skills.json");
}

export function getProfileCv() {
  return fetchJson(API_BASE_URL ? "/api/profile-cv" : "/api/profile-cv.json");
}

/* En mode statique, le contact reste testable dans le navigateur. */
export async function sendContactMessage(messageData) {
  if (!API_BASE_URL) {
    /* Mode demo sans back-end : les messages restent dans le navigateur. */
    const storedMessages = JSON.parse(
      localStorage.getItem("portfolioContactMessages") || "[]"
    );

    localStorage.setItem(
      "portfolioContactMessages",
      JSON.stringify([...storedMessages, { ...messageData, createdAt: new Date().toISOString() }])
    );

    return { success: true };
  }

  /* Mode normal : le message part vers Express puis MongoDB. */
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(messageData),
  });

  return readApiResponse(response, "Impossible d'envoyer le message.");
}

/* L'API renvoie un JWT apres verification du mot de passe cote serveur. */
export async function loginAdmin(credentials) {
  /* Le mot de passe est envoye au serveur pour verification, pas verifie dans React. */
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await readApiResponse(response, "Connexion admin impossible.");

  /* Le serveur renvoie le JWT seulement si les identifiants sont corrects. */
  localStorage.setItem(ADMIN_TOKEN_KEY, data.token);

  return data.admin;
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function getCurrentAdmin() {
  /* Cette route sert a verifier que le token est toujours valide. */
  return fetchWithAuth("/api/auth/me");
}

export function getAdminProjects() {
  return fetchWithAuth("/api/admin/projects");
}

export function createAdminProject(projectData) {
  /* POST = creation d'un nouveau projet. */
  return fetchWithAuth("/api/admin/projects", {
    method: "POST",
    body: JSON.stringify(projectData),
  });
}

export function updateAdminProject(projectId, projectData) {
  /* PUT = remplacement des informations du projet qui porte cet id. */
  return fetchWithAuth(`/api/admin/projects/${projectId}`, {
    method: "PUT",
    body: JSON.stringify(projectData),
  });
}

export function deleteAdminProject(projectId) {
  /* DELETE = suppression du projet qui porte cet id. */
  return fetchWithAuth(`/api/admin/projects/${projectId}`, {
    method: "DELETE",
  });
}

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

export function getAdminProfile() {
  return fetchWithAuth("/api/admin/profile");
}

export function updateAdminProfile(profileData) {
  return fetchWithAuth("/api/admin/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
}

export function getAdminMessages() {
  return fetchWithAuth("/api/admin/messages");
}

export function deleteAdminMessage(messageId) {
  return fetchWithAuth(`/api/admin/messages/${messageId}`, {
    method: "DELETE",
  });
}

export function uploadAdminProjectImage(imageData) {
  return fetchWithAuth("/api/admin/uploads/images", {
    method: "POST",
    body: JSON.stringify(imageData),
  });
}
