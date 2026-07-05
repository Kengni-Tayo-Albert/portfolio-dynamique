import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import Project from "../models/Project.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const projectRoot = path.resolve(currentDirectory, "../../..");
const projectsJsonPath = path.join(
  projectRoot,
  "front",
  "public",
  "api",
  "projects.json"
);

async function seedProjects() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI est absent du fichier .env.");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const jsonContent = await fs.readFile(projectsJsonPath, "utf-8");
    const projects = JSON.parse(jsonContent).map((project) => ({
      ...project,
      sourceId: project.id,
    }));

    await Project.deleteMany({});
    await Project.insertMany(projects);

    console.log(`${projects.length} projets importes dans MongoDB.`);
  } catch (error) {
    console.error("Erreur pendant l'import des projets :", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedProjects();
