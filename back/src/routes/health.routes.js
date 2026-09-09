import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

/* Healthcheck : permet de vérifier rapidement que l'API et la connexion MongoDB répondent. */
router.get("/", (req, res) => {
  res.json({
    status: "ok",
    api: "portfolio-dynamique",
    database:
      mongoose.connection.readyState === 1 ? "connectee" : "non connectee",
  });
});

export default router;
