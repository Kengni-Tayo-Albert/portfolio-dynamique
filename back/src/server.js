import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { validateEnvironment } from "./config/environment.js";

const PORT = process.env.PORT || 5000;

/* Démarre l'API : validation de la configuration, connexion MongoDB, puis écoute HTTP. */
async function startServer() {
  validateEnvironment();
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`API portfolio lancee sur http://localhost:${PORT}`);
  });
}

startServer();
