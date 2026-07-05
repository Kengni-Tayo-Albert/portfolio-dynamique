export function validateRequest(rules) {
  return (req, res, next) => {
    const errors = [];

    for (const rule of rules) {
      const error = rule(req);

      if (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Donnees invalides.",
        errors,
      });
    }

    next();
  };
}
