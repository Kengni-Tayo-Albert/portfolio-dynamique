import ProfileCv from "../models/ProfileCv.js";

/* Retourne le dernier profil/CV publié pour alimenter la page CV. */
export async function getProfileCv(req, res, next) {
  try {
    const profileCv = await ProfileCv.findOne().sort({ createdAt: -1 });

    if (!profileCv) {
      return res.status(404).json({
        message: "Aucun profil CV trouve.",
      });
    }

    res.json(profileCv);
  } catch (error) {
    next(error);
  }
}
