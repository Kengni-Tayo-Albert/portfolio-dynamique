import { Router } from "express";
import { getProfileCv } from "../controllers/profileCv.controller.js";

const router = Router();

/* Route publique qui fournit les données structurées de la page CV. */
router.get("/", getProfileCv);

export default router;
