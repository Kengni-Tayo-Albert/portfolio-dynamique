import Skill from "../models/Skill.js";

/* Retourne le dernier document de competences publie pour alimenter la page Skills. */
export async function getSkills(req, res, next) {
  try {
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
