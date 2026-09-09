import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import {
  clearLoginAttempts,
  registerFailedLogin,
} from "../middlewares/loginRateLimiter.js";

/* Crée le JWT admin avec les informations minimales nécessaires à l'autorisation. */
function createToken(admin) {
  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
  );
}

/* Vérifie les identifiants admin, limite les échecs et renvoie le token de session. */
export async function loginAdmin(req, res, next) {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      registerFailedLogin(req);

      return res.status(401).json({
        message: "Identifiants incorrects.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      registerFailedLogin(req);

      return res.status(401).json({
        message: "Identifiants incorrects.",
      });
    }

    clearLoginAttempts(req);

    const token = createToken(admin);

    res.json({
      token,
      admin: admin.toJSON(),
    });
  } catch (error) {
    next(error);
  }
}

/* Retourne l'admin courant depuis req.admin, rempli par requireAdminAuth. */
export function getCurrentAdmin(req, res) {
  res.json({
    admin: req.admin,
  });
}
