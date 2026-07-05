import { Router } from "express";
import { getCurrentAdmin, loginAdmin } from "../controllers/auth.controller.js";
import { requireAdminAuth } from "../middlewares/authMiddleware.js";
import { limitAdminLoginAttempts } from "../middlewares/loginRateLimiter.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { loginRules } from "../validators/portfolio.validators.js";

const router = Router();

router.post("/login", validateRequest(loginRules), limitAdminLoginAttempts, loginAdmin);
router.get("/me", requireAdminAuth, getCurrentAdmin);

export default router;
