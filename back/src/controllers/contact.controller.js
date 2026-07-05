import ContactMessage from "../models/ContactMessage.js";

export async function createContactMessage(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message enregistre dans MongoDB.",
      contactMessage,
    });
  } catch (error) {
    next(error);
  }
}
