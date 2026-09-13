const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Lit une valeur envoyee dans le body de la requete. */
function getBodyValue(req, field) {
  return req.body?.[field];
}

/* Un champ texte obligatoire est verifie puis nettoye avant le controleur. */
export function requiredString(field, label = field, minLength = 1) {
  return (req) => {
    const value = getBodyValue(req, field);

    if (typeof value !== "string" || value.trim().length < minLength) {
      return `${label} doit contenir au moins ${minLength} caractere(s).`;
    }

    req.body[field] = value.trim();
    return null;
  };
}

/* L'email est stocke en minuscules pour eviter les doublons. */
export function validEmail(field, label = field) {
  return (req) => {
    const value = getBodyValue(req, field);

    if (typeof value !== "string" || !emailRegex.test(value.trim())) {
      return `${label} doit etre une adresse email valide.`;
    }

    req.body[field] = value.trim().toLowerCase();
    return null;
  };
}

/* On accepte seulement les liens web classiques : http ou https. */
export function validUrl(field, label = field) {
  return (req) => {
    const value = getBodyValue(req, field);
    const trimmedValue = typeof value === "string" ? value.trim() : "";

    try {
      const url = new URL(trimmedValue);

      if (!["http:", "https:"].includes(url.protocol)) {
        return `${label} doit etre une URL http ou https.`;
      }
    } catch {
      return `${label} doit etre une URL valide.`;
    }

    req.body[field] = trimmedValue;
    return null;
  };
}

/* Une image peut venir du dossier public du front, des uploads ou d'une URL externe. */
export function validImagePath(field, label = field) {
  return (req) => {
    const value = getBodyValue(req, field);
    const trimmedValue = typeof value === "string" ? value.trim() : "";

    if (trimmedValue.startsWith("/projects/") || trimmedValue.startsWith("/uploads/")) {
      req.body[field] = trimmedValue;
      return null;
    }

    return validUrl(field, label)(req);
  };
}

/* Le front envoie parfois un booleen sous forme de texte depuis un formulaire. */
export function optionalBooleanString(field) {
  return (req) => {
    const value = getBodyValue(req, field);

    if (
      value === undefined ||
      value === true ||
      value === false ||
      value === "true" ||
      value === "false"
    ) {
      return null;
    }

    return `${field} doit valoir true ou false.`;
  };
}

/* Un id MongoDB contient 24 caracteres hexadecimaux. */
export function validMongoIdParam(field = "id") {
  return (req) => {
    const value = req.params?.[field];

    if (!/^[a-f\d]{24}$/i.test(value || "")) {
      return "Identifiant MongoDB invalide.";
    }

    return null;
  };
}
