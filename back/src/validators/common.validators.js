const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getValue(req, field) {
  return req.body?.[field];
}

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

export function validMongoIdParam(field = "id") {
  return (req) => {
    const value = req.params?.[field];

    if (!/^[a-f\d]{24}$/i.test(value || "")) {
      return "Identifiant MongoDB invalide.";
    }

    return null;
  };
}
