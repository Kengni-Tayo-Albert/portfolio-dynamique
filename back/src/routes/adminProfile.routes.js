import { Router } from "express";
import ProfileCv from "../models/ProfileCv.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { profileRules } from "../validators/portfolio.validators.js";

const router = Router();

async function getProfileDocument() {
  const profile = await ProfileCv.findOne().sort({ createdAt: -1 });

  if (!profile) {
    const error = new Error("Aucun profil CV trouve.");
    error.statusCode = 404;
    throw error;
  }

  return profile;
}

async function getAdminProfile(req, res, next) {
  try {
    const profile = await getProfileDocument();

    res.json(profile);
  } catch (error) {
    next(error);
  }
}

async function updateAdminProfile(req, res, next) {
  try {
    const profile = await getProfileDocument();

    /* Le body a deja ete valide : on remplace les sections du CV dynamique. */
    profile.hero = req.body.hero;
    profile.identity = req.body.identity;
    profile.skills = req.body.skills;
    profile.softSkills = req.body.softSkills;
    profile.languages = req.body.languages;
    profile.hobbies = req.body.hobbies;
    profile.formations = req.body.formations;
    profile.experiences = req.body.experiences;

    await profile.save();

    res.json(profile);
  } catch (error) {
    next(error);
  }
}

router.get("/", getAdminProfile);
router.put("/", validateRequest(profileRules), updateAdminProfile);

export default router;
