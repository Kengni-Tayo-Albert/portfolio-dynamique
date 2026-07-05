import jwt from "jsonwebtoken";

export function requireAdminAuth(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token admin manquant.",
    });
  }

  const token = authorizationHeader.replace("Bearer ", "");

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken.role !== "admin") {
      return res.status(403).json({
        message: "Acces reserve a l'administrateur.",
      });
    }

    req.admin = decodedToken;
    next();
  } catch {
    res.status(401).json({
      message: "Session admin invalide ou expiree.",
    });
  }
}
