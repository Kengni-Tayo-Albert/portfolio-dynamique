import { Router } from "express";
import ProfileCv from "../models/ProfileCv.js";

const router = Router();

async function getProfileCv(req, res, next) {
  try {
    /* Le contenu dynamique du CV vient du dernier document ProfileCv. */
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

/* Route publique qui fournit les donnees structurees de la page CV. */
router.get("/", getProfileCv);

export default router;
