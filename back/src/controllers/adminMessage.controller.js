import ContactMessage from "../models/ContactMessage.js";

/* Liste les messages les plus recents pour la section admin Messages. */
export async function getAdminMessages(req, res, next) {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
}

/* Supprime un message de contact depuis le tableau de bord. */
export async function deleteAdminMessage(req, res, next) {
  try {
    const deletedMessage = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!deletedMessage) {
      return res.status(404).json({ message: "Message introuvable." });
    }

    res.json({ message: "Message supprime avec succes." });
  } catch (error) {
    next(error);
  }
}
