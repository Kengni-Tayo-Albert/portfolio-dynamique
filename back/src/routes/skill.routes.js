import { Router } from "express";
import { getSkills } from "../controllers/skill.controller.js";

const router = Router();

/* Route publique qui fournit les groupes de compétences et les statistiques. */
router.get("/", getSkills);

export default router;
