/* Lance les regles de validation avant le controleur. */
export function validateRequest(rules) {
  return (req, res, next) => {
    const errors = [];

    for (const rule of rules) {
      /* Chaque regle renvoie null si tout va bien, ou un message si une donnee est invalide. */
      const error = rule(req);

      if (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      /* 400 signifie : la requete envoyee par le client n'est pas correcte. */
      return res.status(400).json({
        message: "Donnees invalides.",
        errors,
      });
    }

    /* Si aucune erreur n'est trouvee, Express passe au controleur suivant. */
    next();
  };
}
