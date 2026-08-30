import { Router } from "express";
import {
  getProjectById,
  getProjects,
} from "../controllers/project.controller.js";

const router = Router();

/* Routes publiques de lecture des projets pour les pages Home et Projects. */
router.get("/", getProjects);
router.get("/:id", getProjectById);

export default router;
