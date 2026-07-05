import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import ProfileCv from "../models/ProfileCv.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const projectRoot = path.resolve(currentDirectory, "../../..");
const profileCvJsonPath = path.join(
  projectRoot,
  "front",
  "public",
  "api",
  "profile-cv.json"
);

async function seedProfileCv() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI est absent du fichier .env.");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const jsonContent = await fs.readFile(profileCvJsonPath, "utf-8");
    const profileCv = JSON.parse(jsonContent);

    await ProfileCv.deleteMany({});
    await ProfileCv.create(profileCv);

    console.log("Profil CV importe dans MongoDB.");
  } catch (error) {
    console.error("Erreur pendant l'import du profil CV :", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedProfileCv();
