import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import healthRoutes from "./routes/health.routes.js";
import profileCvRoutes from "./routes/profileCv.routes.js";
import projectRoutes from "./routes/project.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import { isProduction } from "./config/environment.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler.js";
import { securityHeaders } from "./middlewares/securityHeaders.js";

const app = express();
const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const publicDirectory = path.resolve(currentDirectory, "../public");

/* On masque Express pour ne pas donner d'information technique inutile. */
app.disable("x-powered-by");

/* Liste des fronts autorises a appeler l'API depuis un navigateur. */
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/* Headers simples contre certains abus navigateur. */
app.use(securityHeaders);

/* CORS bloque les appels venant d'un site non autorise. */
app.use(
  cors({
    origin: (origin, callback) => {
      const isLocalViteApp = !isProduction() && /^http:\/\/localhost:517\d$/.test(origin || "");

      if (!origin || allowedOrigins.includes(origin) || isLocalViteApp) {
        callback(null, true);
        return;
      }

      callback(new Error("Origine non autorisee par CORS."));
    },
  })
);

/* Permet a Express de lire le body JSON envoye par le front. */
app.use(express.json({ limit: "5mb" }));

/* Les images envoyees par l'admin deviennent accessibles avec /uploads/nom-du-fichier. */
app.use("/uploads", express.static(path.join(publicDirectory, "uploads")));

app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API du portfolio dynamique.",
  });
});

/* Chaque route branche un domaine du projet : auth, admin, projets, contact, etc. */
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/profile-cv", profileCvRoutes);
app.use("/api/contact", contactRoutes);

/* Si aucune route ne correspond, on renvoie une erreur 404. */
app.use(notFoundHandler);

/* Derniere etape : convertir les erreurs en reponses JSON propres. */
app.use(errorHandler);

export default app;
