import { Router } from "express";
import { createContactMessage } from "../controllers/contact.controller.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { contactRules } from "../validators/portfolio.validators.js";

const router = Router();

router.post("/", validateRequest(contactRules), createContactMessage);

export default router;
