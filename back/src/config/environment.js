const minimumJwtSecretLength = 32;
const minimumAdminPasswordLength = 12;

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function validateStrongPassword(password) {
  const hasMinimumLength = typeof password === "string" && password.length >= minimumAdminPasswordLength;
  const hasLowercase = /[a-z]/.test(password || "");
  const hasUppercase = /[A-Z]/.test(password || "");
  const hasNumber = /\d/.test(password || "");
  const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password || "");

  return (
    hasMinimumLength &&
    hasLowercase &&
    hasUppercase &&
    hasNumber &&
    hasSpecialCharacter
  );
}

function checkJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret || jwtSecret.length < minimumJwtSecretLength) {
    return `JWT_SECRET doit contenir au moins ${minimumJwtSecretLength} caracteres.`;
  }

  if (jwtSecret.includes("CHANGE_ME")) {
    return "JWT_SECRET ne doit pas garder la valeur d'exemple.";
  }

  return null;
}

function checkClientUrl() {
  const clientUrl = process.env.CLIENT_URL;

  if (isProduction() && !clientUrl) {
    return "CLIENT_URL doit contenir l'URL finale du front en production.";
  }

  return null;
}

export function validateEnvironment() {
  const errors = [checkJwtSecret(), checkClientUrl()].filter(Boolean);

  if (errors.length === 0) return;

  const message = `Configuration de securite incomplete : ${errors.join(" ")}`;

  if (isProduction()) {
    throw new Error(message);
  }

  console.warn(message);
}

export function validateAdminPassword(password) {
  if (!validateStrongPassword(password)) {
    throw new Error(
      `ADMIN_PASSWORD doit contenir au moins ${minimumAdminPasswordLength} caracteres, une majuscule, une minuscule, un chiffre et un caractere special.`
    );
  }
}
