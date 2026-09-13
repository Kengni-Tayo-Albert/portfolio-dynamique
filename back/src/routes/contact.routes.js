import { Router } from "express";
import ContactMessage from "../models/ContactMessage.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { contactRules } from "../validators/portfolio.validators.js";

const router = Router();

async function createContactMessage(req, res, next) {
  try {
    /* Ces champs sont les seules donnees personnelles demandees au visiteur. */
    const { name, email, subject, message } = req.body;

    /* ContactMessage.create enregistre le message dans MongoDB. */
    await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    /* La reponse confirme l'enregistrement sans renvoyer les donnees personnelles. */
    res.status(201).json({
      success: true,
      message: "Message enregistre.",
    });
  } catch (error) {
    next(error);
  }
}

/* Formulaire public : validation serveur puis enregistrement dans MongoDB. */
router.post("/", validateRequest(contactRules), createContactMessage);

export default router;
