import ProfileCv from "../models/ProfileCv.js";

/* Récupère le document profil/CV actif pour le dashboard admin. */
async function getProfileDocument() {
  const profile = await ProfileCv.findOne().sort({ createdAt: -1 });

  if (!profile) {
    const error = new Error("Aucun profil CV trouve.");
    error.statusCode = 404;
    throw error;
  }

  return profile;
}

/* Renvoie toutes les sections du CV pour édition dans l'interface admin. */
export async function getAdminProfile(req, res, next) {
  try {
    const profile = await getProfileDocument();

    res.json(profile);
  } catch (error) {
    next(error);
  }
}

/* Remplace les sections du profil/CV par le payload déjà validé par les validators. */
export async function updateAdminProfile(req, res, next) {
  try {
    const {
      hero,
      identity,
      skills,
      softSkills,
      languages,
      hobbies,
      formations,
      experiences,
    } = req.body;
    const profile = await getProfileDocument();

    profile.hero = hero;
    profile.identity = identity;
    profile.skills = skills;
    profile.softSkills = softSkills;
    profile.languages = languages;
    profile.hobbies = hobbies;
    profile.formations = formations;
    profile.experiences = experiences;

    await profile.save();

    res.json(profile);
  } catch (error) {
    next(error);
  }
}
