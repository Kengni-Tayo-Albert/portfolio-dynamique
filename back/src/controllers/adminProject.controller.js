import Project from "../models/Project.js";

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.trim()).filter(Boolean);
  }

  return String(tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

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
    tags: normalizeTags(body.tags),
    github: body.github,
    demo: body.demo,
    featured: body.featured === true || body.featured === "true",
  };
}

export async function getAdminProjects(req, res, next) {
  try {
    const projects = await Project.find().sort({ sourceId: 1 });

    res.json(projects);
  } catch (error) {
    next(error);
  }
}

export async function createAdminProject(req, res, next) {
  try {
    const project = await Project.create({
      ...buildProjectPayload(req.body),
      sourceId: await getNextSourceId(),
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
}

export async function updateAdminProject(req, res, next) {
  try {
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

export async function deleteAdminProject(req, res, next) {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Projet introuvable." });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}
