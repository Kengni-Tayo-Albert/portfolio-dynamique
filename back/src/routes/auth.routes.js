import { Router } from "express";
import { getCurrentAdmin, loginAdmin } from "../controllers/auth.controller.js";
import { requireAdminAuth } from "../middlewares/authMiddleware.js";
import { limitAdminLoginAttempts } from "../middlewares/loginRateLimiter.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { loginRules } from "../validators/portfolio.validators.js";

const router = Router();

/* Login admin : validation des champs, limitation des tentatives, puis génération du JWT. */
router.post("/login", validateRequest(loginRules), limitAdminLoginAttempts, loginAdmin);
/* Session courante : confirme que le token est encore valide. */
router.get("/me", requireAdminAuth, getCurrentAdmin);

export default router;
