import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { requireAdminAuth } from "../middlewares/authMiddleware.js";
import {
  clearLoginAttempts,
  limitAdminLoginAttempts,
  registerFailedLogin,
} from "../middlewares/loginRateLimiter.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { loginRules } from "../validators/portfolio.validators.js";

const router = Router();

function createAdminToken(admin) {
  /* Le token contient seulement les infos utiles pour reconnaitre l'admin. */
  const tokenPayload = {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  };

  return jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    /* Apres ce delai, le token expire et l'admin doit se reconnecter. */
    expiresIn: process.env.JWT_EXPIRES_IN || "2h",
  });
}

async function passwordMatches(admin, password) {
  /* Meme si l'email n'existe pas, on garde une reponse simple. */
  if (!admin) return false;

  /* bcrypt compare le mot de passe saisi avec le hash stocke en base. */
  return bcrypt.compare(password, admin.passwordHash);
}

function rejectLogin(req, res) {
  /* Chaque echec est compte pour limiter les essais de mot de passe. */
  registerFailedLogin(req);

  return res.status(401).json({
    message: "Identifiants incorrects.",
  });
}

async function loginAdmin(req, res, next) {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    const credentialsAreValid = await passwordMatches(admin, password);

    if (!credentialsAreValid) {
      return rejectLogin(req, res);
    }

    clearLoginAttempts(req);

    res.json({
      token: createAdminToken(admin),
      admin: admin.toJSON(),
    });
  } catch (error) {
    next(error);
  }
}

function getCurrentAdmin(req, res) {
  /* requireAdminAuth a deja verifie le token avant d'arriver ici. */
  res.json({
    admin: req.admin,
  });
}

/* Login admin : validation, limitation des tentatives, puis creation du JWT. */
router.post("/login", validateRequest(loginRules), limitAdminLoginAttempts, loginAdmin);

/* Session courante : confirme que le token est encore valide. */
router.get("/me", requireAdminAuth, getCurrentAdmin);

export default router;
