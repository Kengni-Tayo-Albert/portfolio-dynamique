import ContactMessage from "../models/ContactMessage.js";

export async function getAdminMessages(req, res, next) {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
}
