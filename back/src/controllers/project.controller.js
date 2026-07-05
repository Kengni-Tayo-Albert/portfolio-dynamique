import Project from "../models/Project.js";

export async function getProjects(req, res, next) {
  try {
    const projects = await Project.find().sort({ sourceId: 1 });

    res.json(projects);
  } catch (error) {
    next(error);
  }
}

export async function getProjectById(req, res, next) {
  try {
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
