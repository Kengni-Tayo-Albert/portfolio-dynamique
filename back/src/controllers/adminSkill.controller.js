import Skill from "../models/Skill.js";

/* Recupere le document de competences actif ; les competences sont stockees par groupes. */
async function getSkillDocument() {
  const skills = await Skill.findOne().sort({ createdAt: -1 });

  if (!skills) {
    const error = new Error("Aucun document de competences trouve.");
    error.statusCode = 404;
    throw error;
  }

  return skills;
}

/* Aplatit les competences pour simplifier l'affichage et l'edition dans le dashboard. */
function flattenSkillItems(skills) {
  return skills.groups.flatMap((group) =>
    group.items.map((item) => ({
      id: `${group.title}|||${item.label}`,
      label: item.label,
      title: item.label,
      icon: item.icon,
      groupTitle: group.title,
      category: group.title,
    }))
  );
}

/* Retrouve le groupe cible dans le document MongoDB. */
function findGroup(skills, groupTitle) {
  return skills.groups.find((group) => group.title === groupTitle);
}

/* Liste admin des competences sous forme plate, plus pratique pour une table d'edition. */
export async function getAdminSkills(req, res, next) {
  try {
    const skills = await getSkillDocument();

    res.json(flattenSkillItems(skills));
  } catch (error) {
    next(error);
  }
}

/* Ajoute une competence dans le groupe choisi depuis le dashboard. */
export async function createAdminSkill(req, res, next) {
  try {
    const { label, icon, groupTitle } = req.body;
    const skills = await getSkillDocument();
    const group = findGroup(skills, groupTitle);

    if (!group) {
      return res.status(404).json({ message: "Groupe de competences introuvable." });
    }

    group.items.push({ label, icon });
    await skills.save();

    res.status(201).json(flattenSkillItems(skills));
  } catch (error) {
    next(error);
  }
}

/* Deplace ou renomme une competence en supprimant l'ancien item puis en ajoutant le nouveau. */
export async function updateAdminSkill(req, res, next) {
  try {
    const { id, label, icon, groupTitle } = req.body;
    const [oldGroupTitle, oldLabel] = String(id || "").split("|||");
    const skills = await getSkillDocument();
    const oldGroup = findGroup(skills, oldGroupTitle);
    const newGroup = findGroup(skills, groupTitle);

    if (!oldGroup || !newGroup) {
      return res.status(404).json({ message: "Competence introuvable." });
    }

    oldGroup.items = oldGroup.items.filter((item) => item.label !== oldLabel);
    newGroup.items.push({ label, icon });
    await skills.save();

    res.json(flattenSkillItems(skills));
  } catch (error) {
    next(error);
  }
}

/* Supprime une competence identifiee par son groupe et son libelle. */
export async function deleteAdminSkill(req, res, next) {
  try {
    const { id } = req.body;
    const [groupTitle, label] = String(id || "").split("|||");
    const skills = await getSkillDocument();
    const group = findGroup(skills, groupTitle);

    if (!group) {
      return res.status(404).json({ message: "Groupe de competences introuvable." });
    }

    group.items = group.items.filter((item) => item.label !== label);
    await skills.save();

    res.json(flattenSkillItems(skills));
  } catch (error) {
    next(error);
  }
}
