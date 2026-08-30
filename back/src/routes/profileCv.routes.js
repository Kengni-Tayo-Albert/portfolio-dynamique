import { Router } from "express";
import { getProfileCv } from "../controllers/profileCv.controller.js";

const router = Router();

/* Route publique qui fournit les donnees structurees de la page CV. */
router.get("/", getProfileCv);

export default router;
