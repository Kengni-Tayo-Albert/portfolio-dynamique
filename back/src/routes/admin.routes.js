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
import { getAdminMessages } from "../controllers/adminMessage.controller.js";
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

router.use(requireAdminAuth);

router.get("/projects", getAdminProjects);
router.post("/projects", validateRequest(projectRules), createAdminProject);
router.put(
  "/projects/:id",
  validateRequest([...projectIdRules, ...projectRules]),
  updateAdminProject
);
router.delete("/projects/:id", validateRequest(projectIdRules), deleteAdminProject);

router.get("/skills", getAdminSkills);
router.post("/skills", validateRequest(skillRules), createAdminSkill);
router.put("/skills", validateRequest(updateSkillRules), updateAdminSkill);
router.delete("/skills", validateRequest(deleteSkillRules), deleteAdminSkill);

router.get("/profile", getAdminProfile);
router.put("/profile", validateRequest(profileRules), updateAdminProfile);

router.get("/messages", getAdminMessages);

router.post("/uploads/images", uploadAdminImage);

export default router;
