import { Router } from "express";
import ContactMessage from "../models/ContactMessage.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { projectIdRules } from "../validators/portfolio.validators.js";

const router = Router();

async function getAdminMessages(req, res, next) {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
}

async function deleteAdminMessage(req, res, next) {
  try {
    const deletedMessage = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!deletedMessage) {
      return res.status(404).json({ message: "Message introuvable." });
    }

    res.json({ message: "Message supprime avec succes." });
  } catch (error) {
    next(error);
  }
}

router.get("/", getAdminMessages);
router.delete("/:id", validateRequest(projectIdRules), deleteAdminMessage);

export default router;
