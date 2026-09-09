import { Router } from "express";
import {
  createAdminProject,
  deleteAdminProject,
  getAdminProjects,
  updateAdminProject,
} from "../controllers/adminProject.controller.js";
import {
  createAdminSkill,
  deleteAdminSkill,
  getAdminSkills,
  updateAdminSkill,
} from "../controllers/adminSkill.controller.js";
import {
  getAdminProfile,
  updateAdminProfile,
} from "../controllers/adminProfile.controller.js";
import {
  deleteAdminMessage,
  getAdminMessages,
} from "../controllers/adminMessage.controller.js";
import { uploadAdminImage } from "../controllers/adminUpload.controller.js";
import { requireAdminAuth } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  deleteSkillRules,
  profileRules,
  projectIdRules,
  projectRules,
  skillRules,
  updateSkillRules,
} from "../validators/portfolio.validators.js";

const router = Router();

/* Toutes les routes admin passent d'abord par la vérification du token JWT. */
router.use(requireAdminAuth);

/* Projets : CRUD complet pour alimenter et modifier la page publique Projets. */
router.get("/projects", getAdminProjects);
router.post("/projects", validateRequest(projectRules), createAdminProject);
router.put(
  "/projects/:id",
  validateRequest([...projectIdRules, ...projectRules]),
  updateAdminProject
);
router.delete("/projects/:id", validateRequest(projectIdRules), deleteAdminProject);

/* Compétences : édition des items stockés dans les groupes du document Skill. */
router.get("/skills", getAdminSkills);
router.post("/skills", validateRequest(skillRules), createAdminSkill);
router.put("/skills", validateRequest(updateSkillRules), updateAdminSkill);
router.delete("/skills", validateRequest(deleteSkillRules), deleteAdminSkill);

/* Profil/CV : lecture et remplacement du document affiché sur la page CV. */
router.get("/profile", getAdminProfile);
router.put("/profile", validateRequest(profileRules), updateAdminProfile);

/* Messages : consultation et suppression des messages reçus depuis le formulaire public. */
router.get("/messages", getAdminMessages);
router.delete("/messages/:id", validateRequest(projectIdRules), deleteAdminMessage);

/* Uploads : création d'une image publique réutilisable dans une fiche projet. */
router.post("/uploads/images", uploadAdminImage);

export default router;
