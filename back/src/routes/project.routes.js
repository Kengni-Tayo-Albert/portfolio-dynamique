import { Router } from "express";
import Project from "../models/Project.js";

const router = Router();

async function getProjects(req, res, next) {
  try {
    /* find() lit tous les projets dans MongoDB. */
    const projects = await Project.find().sort({ sourceId: 1 });

    res.json(projects);
  } catch (error) {
    next(error);
  }
}

async function getProjectById(req, res, next) {
  try {
    /* req.params.id vient de l'URL : /api/projects/:id. */
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Projet introuvable.",
      });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
}

/* Routes publiques de lecture des projets pour les pages Home et Projects. */
router.get("/", getProjects);
router.get("/:id", getProjectById);

export default router;
