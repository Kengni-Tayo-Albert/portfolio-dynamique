export function notFoundHandler(req, res, next) {
  const error = new Error(`Route introuvable : ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, req, res, next) {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      message: "Le corps de la requete JSON est invalide.",
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Donnees invalides.",
      errors: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      message: "Identifiant invalide.",
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      message: "Cette ressource existe deja.",
    });
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || "Erreur serveur.",
  });
}
