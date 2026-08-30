import { Router } from "express";
import { createContactMessage } from "../controllers/contact.controller.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { contactRules } from "../validators/portfolio.validators.js";

const router = Router();

/* Formulaire public : valide le message avant de l'enregistrer dans MongoDB. */
router.post("/", validateRequest(contactRules), createContactMessage);

export default router;
