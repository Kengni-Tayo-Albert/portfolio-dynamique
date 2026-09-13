import { Router } from "express";
import Skill from "../models/Skill.js";

const router = Router();

async function getSkills(req, res, next) {
  try {
    /* On recupere le dernier document qui contient les groupes de competences. */
    const skills = await Skill.findOne().sort({ createdAt: -1 });

    if (!skills) {
      return res.status(404).json({
        message: "Aucune competence trouvee.",
      });
    }

    res.json({
      groups: skills.groups,
      stats: skills.stats,
    });
  } catch (error) {
    next(error);
  }
}

/* Route publique qui fournit les groupes de competences et les statistiques. */
router.get("/", getSkills);

export default router;
