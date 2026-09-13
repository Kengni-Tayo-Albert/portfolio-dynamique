/* Valeurs de depart des formulaires admin. */
export const emptyProjectForm = {
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

export const emptySkillForm = {
  id: "",
  label: "",
  icon: "",
  groupTitle: "FRONT-END",
};

export const groupOptions = ["FRONT-END", "BACK-END", "OUTILS & DEVOPS", "SOFT SKILLS"];

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

/* Conversion entre les tableaux MongoDB et les champs texte du formulaire CV. */
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
    const [icon = "", label = "", href = ""] = line
      .split("|")
      .map((item) => item.trim());

    return { icon, label, href };
  });
}

function hobbiesToText(hobbies = []) {
  return hobbies.map((hobby) => `${hobby.icon} | ${hobby.label}`).join("\n");
}

function textToHobbies(text) {
  return textToList(text).map((line) => {
    const [icon = "", label = ""] = line
      .split("|")
      .map((item) => item.trim());

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

/* Cree l'etat du formulaire CV a partir du document recu de MongoDB. */
export function createProfileForm(profile) {
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

/* Recompose le document attendu par l'API avant la sauvegarde du CV. */
export function buildProfilePayload(form) {
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

/* Petits outils utilises par le dashboard. */
export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Lecture de l'image impossible."));
    reader.readAsDataURL(file);
  });
}

export function getErrorMessage(error, fallbackMessage) {
  return error instanceof Error ? error.message : fallbackMessage;
}
