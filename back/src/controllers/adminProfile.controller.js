import ProfileCv from "../models/ProfileCv.js";

async function getProfileDocument() {
  const profile = await ProfileCv.findOne().sort({ createdAt: -1 });

  if (!profile) {
    const error = new Error("Aucun profil CV trouve.");
    error.statusCode = 404;
    throw error;
  }

  return profile;
}

export async function getAdminProfile(req, res, next) {
  try {
    const profile = await getProfileDocument();

    res.json(profile);
  } catch (error) {
    next(error);
  }
}

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
