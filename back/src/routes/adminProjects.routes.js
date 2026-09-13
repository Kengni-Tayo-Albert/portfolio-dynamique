import { Router } from "express";
import Project from "../models/Project.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  projectIdRules,
  projectRules,
} from "../validators/portfolio.validators.js";

const router = Router();

async function getNextSourceId() {
  const lastProject = await Project.findOne().sort({ sourceId: -1 });

  return (lastProject?.sourceId || 0) + 1;
}

function buildProjectPayload(body) {
  return {
    title: body.title,
    subtitle: body.subtitle || body.title,
    description: body.description,
    shortDescription: body.shortDescription || body.description,
    image: body.image,
    tags: body.tags,
    github: body.github,
    demo: body.demo,
    featured: body.featured === true || body.featured === "true",
  };
}

async function getAdminProjects(req, res, next) {
  try {
    const projects = await Project.find().sort({ sourceId: 1 });

    res.json(projects);
  } catch (error) {
    next(error);
  }
}

async function createAdminProject(req, res, next) {
  try {
    /* Project.create ajoute un nouveau document dans MongoDB. */
    const project = await Project.create({
      ...buildProjectPayload(req.body),
      sourceId: await getNextSourceId(),
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
}

async function updateAdminProject(req, res, next) {
  try {
    /* L'id vient de l'URL : /api/admin/projects/:id. */
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      buildProjectPayload(req.body),
      { returnDocument: "after", runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Projet introuvable." });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
}

async function deleteAdminProject(req, res, next) {
  try {
    /* findByIdAndDelete supprime le document qui correspond a l'id. */
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Projet introuvable." });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

router.get("/", getAdminProjects);
router.post("/", validateRequest(projectRules), createAdminProject);
router.put("/:id", validateRequest([...projectIdRules, ...projectRules]), updateAdminProject);
router.delete("/:id", validateRequest(projectIdRules), deleteAdminProject);

export default router;
