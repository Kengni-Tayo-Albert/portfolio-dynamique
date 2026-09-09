const attemptsByKey = new Map();
const maxFailedAttempts = 5;
const windowMs = 15 * 60 * 1000;

/* Clé de limitation : combine IP et email pour isoler les tentatives par compte cible. */
function getLoginKey(req) {
  const email = String(req.body?.email || "").trim().toLowerCase();

  return `${req.ip}:${email}`;
}

/* Retourne l'état courant de limitation ou crée une nouvelle fenêtre de 15 minutes. */
function getEntry(key) {
  const now = Date.now();
  const entry = attemptsByKey.get(key);

  if (!entry || entry.resetAt <= now) {
    return {
      count: 0,
      resetAt: now + windowMs,
    };
  }

  return entry;
}

/* Bloque temporairement la connexion admin après trop d'échecs rapprochés. */
export function limitAdminLoginAttempts(req, res, next) {
  const key = getLoginKey(req);
  const entry = getEntry(key);

  if (entry.count >= maxFailedAttempts) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - Date.now()) / 1000);

    res.setHeader("Retry-After", String(retryAfterSeconds));

    return res.status(429).json({
      message: "Trop de tentatives de connexion. Reessayez plus tard.",
    });
  }

  req.loginRateLimitKey = key;
  next();
}

/* Incrémente le compteur après un email inconnu ou un mauvais mot de passe. */
export function registerFailedLogin(req) {
  const key = req.loginRateLimitKey || getLoginKey(req);
  const entry = getEntry(key);

  attemptsByKey.set(key, {
    count: entry.count + 1,
    resetAt: entry.resetAt,
  });
}

/* Remet le compteur à zéro après une connexion réussie. */
export function clearLoginAttempts(req) {
  const key = req.loginRateLimitKey || getLoginKey(req);

  attemptsByKey.delete(key);
}
