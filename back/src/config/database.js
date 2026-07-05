import mongoose from "mongoose";

export async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn("MONGO_URI est absent. Connexion MongoDB ignoree.");
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connexion MongoDB reussie.");
  } catch (error) {
    console.error("Erreur de connexion MongoDB :", error.message);
    console.warn("Le serveur Express continue sans base de donnees.");
  }
}
