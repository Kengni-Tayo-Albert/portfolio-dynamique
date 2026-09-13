import { Router } from "express";
import adminMessagesRoutes from "./adminMessages.routes.js";
import adminProfileRoutes from "./adminProfile.routes.js";
import adminProjectsRoutes from "./adminProjects.routes.js";
import adminSkillsRoutes from "./adminSkills.routes.js";
import adminUploadsRoutes from "./adminUploads.routes.js";
import { requireAdminAuth } from "../middlewares/authMiddleware.js";

const router = Router();

/* Toutes les routes /api/admin/* sont protegees par le JWT admin. */
router.use(requireAdminAuth);

/* Chaque sous-route garde ses fonctions directes dans un fichier court. */
router.use("/projects", adminProjectsRoutes);
router.use("/skills", adminSkillsRoutes);
router.use("/profile", adminProfileRoutes);
router.use("/messages", adminMessagesRoutes);
router.use("/uploads", adminUploadsRoutes);

export default router;
