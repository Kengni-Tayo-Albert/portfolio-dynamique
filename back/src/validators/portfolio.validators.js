import {
  optionalBooleanString,
  optionalString,
  requiredString,
  validEmail,
  validImagePath,
  validMongoIdParam,
  validUrl,
} from "./common.validators.js";

const allowedSkillGroups = ["FRONT-END", "BACK-END", "OUTILS & DEVOPS", "SOFT SKILLS"];

export const loginRules = [
  validEmail("email", "Email"),
  requiredString("password", "Mot de passe", 8),
];

export const contactRules = [
  requiredString("name", "Nom", 2),
  validEmail("email", "Email"),
  requiredString("subject", "Sujet", 2),
  requiredString("message", "Message", 10),
];

export const projectIdRules = [validMongoIdParam("id")];

export const projectRules = [
  requiredString("title", "Titre", 2),
  requiredString("subtitle", "Sous-titre", 2),
  requiredString("description", "Description", 10),
  requiredString("shortDescription", "Description courte", 5),
  validImagePath("image", "Image"),
  requiredString("tags", "Technologies", 2),
  validUrl("github", "Lien GitHub"),
  validUrl("demo", "Lien demo"),
  optionalBooleanString("featured"),
];

export const skillRules = [
  requiredString("label", "Nom de la competence", 2),
  requiredString("icon", "Icone", 2),
  (req) => {
    const groupTitle = req.body?.groupTitle;

    if (!allowedSkillGroups.includes(groupTitle)) {
      return "Le groupe de competences est invalide.";
    }

    return null;
  },
];

export const updateSkillRules = [
  requiredString("id", "Identifiant de la competence", 3),
  ...skillRules,
];

export const deleteSkillRules = [
  requiredString("id", "Identifiant de la competence", 3),
];

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function requireNestedText(source, field, label, minLength = 1) {
  const value = cleanText(source?.[field]);

  if (value.length < minLength) {
    return `${label} doit contenir au moins ${minLength} caractere(s).`;
  }

  source[field] = value;
  return null;
}

function validateTextList(source, field, label) {
  if (!Array.isArray(source?.[field])) {
    return `${label} doit etre une liste.`;
  }

  const values = source[field]
    .map((item) => cleanText(item))
    .filter(Boolean);

  if (values.length === 0) {
    return `${label} doit contenir au moins un element.`;
  }

  source[field] = values;
  return null;
}

function validateContactList(identity) {
  if (!Array.isArray(identity.contacts)) {
    return "Les contacts doivent etre une liste.";
  }

  const contacts = identity.contacts.map((contact) => ({
    icon: cleanText(contact?.icon),
    label: cleanText(contact?.label),
    href: cleanText(contact?.href),
  }));

  if (contacts.some((contact) => !contact.icon || !contact.label || !contact.href)) {
    return "Chaque contact doit contenir une icone, un libelle et un lien.";
  }

  identity.contacts = contacts;
  return null;
}

function validateHobbies(profile) {
  if (!Array.isArray(profile.hobbies)) {
    return "Les loisirs doivent etre une liste.";
  }

  const hobbies = profile.hobbies.map((hobby) => ({
    icon: cleanText(hobby?.icon),
    label: cleanText(hobby?.label),
  }));

  if (hobbies.length === 0 || hobbies.some((hobby) => !hobby.icon || !hobby.label)) {
    return "Chaque loisir doit contenir une icone et un libelle.";
  }

  profile.hobbies = hobbies;
  return null;
}

function validateFormations(profile) {
  if (!Array.isArray(profile.formations)) {
    return "Le parcours academique doit etre une liste.";
  }

  const formations = profile.formations.map((formation) => ({
    title: cleanText(formation?.title),
    place: cleanText(formation?.place),
    date: cleanText(formation?.date),
    detail: cleanText(formation?.detail),
  }));

  if (
    formations.length === 0 ||
    formations.some(
      (formation) =>
        !formation.title || !formation.place || !formation.date || !formation.detail
    )
  ) {
    return "Chaque formation doit contenir un titre, un lieu, une date et un detail.";
  }

  profile.formations = formations;
  return null;
}

function validateExperiences(profile) {
  if (!Array.isArray(profile.experiences)) {
    return "Les experiences doivent etre une liste.";
  }

  const experiences = profile.experiences.map((experience) => ({
    title: cleanText(experience?.title),
    company: cleanText(experience?.company),
    date: cleanText(experience?.date),
    place: cleanText(experience?.place),
    missions: Array.isArray(experience?.missions)
      ? experience.missions.map((mission) => cleanText(mission)).filter(Boolean)
      : [],
  }));

  if (
    experiences.length === 0 ||
    experiences.some(
      (experience) =>
        !experience.title ||
        !experience.company ||
        !experience.date ||
        !experience.place ||
        experience.missions.length === 0
    )
  ) {
    return "Chaque experience doit contenir un titre, une entreprise, une date, un lieu et au moins une mission.";
  }

  profile.experiences = experiences;
  return null;
}

function validateProfilePayload(req) {
  const profile = req.body;

  if (!isObject(profile?.hero) || !isObject(profile?.identity)) {
    return "Le profil CV doit contenir une partie hero et une partie identite.";
  }

  const validationError =
    requireNestedText(profile.hero, "name", "Nom", 2) ||
    requireNestedText(profile.hero, "title", "Titre professionnel", 2) ||
    requireNestedText(profile.hero, "summary", "Resume", 20) ||
    requireNestedText(profile.identity, "age", "Age", 2) ||
    validateContactList(profile.identity) ||
    validateTextList(profile, "skills", "Les competences") ||
    validateTextList(profile, "softSkills", "Les savoir-etre") ||
    validateTextList(profile, "languages", "Les langues") ||
    validateHobbies(profile) ||
    validateFormations(profile) ||
    validateExperiences(profile);

  return validationError || null;
}

export const profileRules = [validateProfilePayload];
