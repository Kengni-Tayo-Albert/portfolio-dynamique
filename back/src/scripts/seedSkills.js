import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import Skill from "../models/Skill.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const projectRoot = path.resolve(currentDirectory, "../../..");
const skillsJsonPath = path.join(
  projectRoot,
  "front",
  "public",
  "api",
  "skills.json"
);

async function seedSkills() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI est absent du fichier .env.");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const jsonContent = await fs.readFile(skillsJsonPath, "utf-8");
    const skills = JSON.parse(jsonContent);

    await Skill.deleteMany({});
    await Skill.create(skills);

    console.log("Competences importees dans MongoDB.");
  } catch (error) {
    console.error("Erreur pendant l'import des competences :", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedSkills();
