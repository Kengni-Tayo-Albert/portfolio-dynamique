const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Recupere une valeur du body en gardant les validateurs courts et reutilisables. */
function getValue(req, field) {
  return req.body?.[field];
}

/* Valide un champ texte obligatoire et le nettoie avant le controleur. */
export function requiredString(field, label = field, minLength = 1) {
  return (req) => {
    const value = getValue(req, field);

    if (typeof value !== "string" || value.trim().length < minLength) {
      return `${label} doit contenir au moins ${minLength} caractere(s).`;
    }

    req.body[field] = value.trim();
    return null;
  };
}

/* Valide un champ texte optionnel uniquement s'il est present. */
export function optionalString(field) {
  return (req) => {
    const value = getValue(req, field);

    if (value === undefined || value === null || value === "") {
      return null;
    }

    if (typeof value !== "string") {
      return `${field} doit etre une chaine de caracteres.`;
    }

    req.body[field] = value.trim();
    return null;
  };
}

/* Valide et normalise une adresse email. */
export function validEmail(field, label = field) {
  return (req) => {
    const value = getValue(req, field);

    if (typeof value !== "string" || !emailRegex.test(value.trim())) {
      return `${label} doit etre une adresse email valide.`;
    }

    req.body[field] = value.trim().toLowerCase();
    return null;
  };
}

/* Valide une URL publique en limitant les protocoles a HTTP/HTTPS. */
export function validUrl(field, label = field) {
  return (req) => {
    const value = getValue(req, field);

    try {
      const url = new URL(value);
      const isValidProtocol = ["http:", "https:"].includes(url.protocol);

      if (!isValidProtocol) {
        return `${label} doit etre une URL http ou https.`;
      }
    } catch {
      return `${label} doit etre une URL valide.`;
    }

    req.body[field] = value.trim();
    return null;
  };
}

/* Accepte soit une image locale du front, soit une URL externe valide. */
export function validImagePath(field, label = field) {
  return (req) => {
    const value = getValue(req, field);
    const isLocalAsset = typeof value === "string" && value.trim().startsWith("/projects/");

    if (isLocalAsset) {
      req.body[field] = value.trim();
      return null;
    }

    return validUrl(field, label)(req);
  };
}

/* Accepte les booleens reels ou les booleens envoyes comme chaines depuis un formulaire HTML. */
export function optionalBooleanString(field) {
  return (req) => {
    const value = getValue(req, field);

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

/* Verifie qu'un parametre d'URL ressemble a un ObjectId MongoDB. */
export function validMongoIdParam(field = "id") {
  return (req) => {
    const value = req.params?.[field];

    if (!/^[a-f\d]{24}$/i.test(value || "")) {
      return "Identifiant MongoDB invalide.";
    }

    return null;
  };
}
