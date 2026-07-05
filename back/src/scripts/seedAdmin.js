import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import { validateAdminPassword } from "../config/environment.js";

async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI est absent du fichier .env.");
    }

    if (!adminEmail || !adminPassword) {
      throw new Error("ADMIN_EMAIL et ADMIN_PASSWORD doivent etre definis dans .env.");
    }

    validateAdminPassword(adminPassword);

    await mongoose.connect(process.env.MONGO_URI);

    const passwordHash = await bcrypt.hash(adminPassword, 12);

    await Admin.findOneAndUpdate(
      { email: adminEmail },
      {
        email: adminEmail,
        passwordHash,
        role: "admin",
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    console.log(`Compte admin pret : ${adminEmail}`);
  } catch (error) {
    console.error("Erreur pendant la creation du compte admin :", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
