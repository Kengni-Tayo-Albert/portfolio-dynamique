import jwt from "jsonwebtoken";

function readBearerToken(req) {
  /* Le front envoie le token dans l'en-tete Authorization. */
  const authorizationHeader = req.headers.authorization || "";

  /* Si l'en-tete ne commence pas par Bearer, ce n'est pas le format attendu. */
  if (!authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  /* On retire "Bearer " pour garder seulement le JWT. */
  return authorizationHeader.slice("Bearer ".length);
}

function isAdminToken(decodedToken) {
  /* Le role admin est obligatoire pour acceder au back-office. */
  return decodedToken?.role === "admin";
}

/* Protection admin : le serveur verifie le JWT avant chaque route sensible. */
export function requireAdminAuth(req, res, next) {
  const token = readBearerToken(req);

  if (!token) {
    return res.status(401).json({
      message: "Token admin manquant.",
    });
  }

  try {
    /* jwt.verify controle la signature et l'expiration du token. */
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!isAdminToken(decodedToken)) {
      return res.status(403).json({
        message: "Acces reserve a l'administrateur.",
      });
    }

    /* On garde les infos du token pour les fonctions de route suivantes. */
    req.admin = decodedToken;
    next();
  } catch {
    res.status(401).json({
      message: "Session admin invalide ou expiree.",
    });
  }
}
