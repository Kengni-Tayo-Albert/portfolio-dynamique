import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

/* Healthcheck : permet de verifier rapidement que l'API et la connexion MongoDB repondent. */
router.get("/", (req, res) => {
  res.json({
    status: "ok",
    api: "portfolio-dynamique",
    database:
      mongoose.connection.readyState === 1 ? "connectee" : "non connectee",
  });
});

export default router;
