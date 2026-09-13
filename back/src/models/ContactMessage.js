import mongoose from "mongoose";

/* Donnees du formulaire contact : nom, email, sujet et message. */
const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      /* L'email est normalise en minuscules avant stockage. */
      lowercase: true,
      /* Mongoose refuse les emails qui ne respectent pas ce format simple. */
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
  },
  {
    timestamps: true,
  }
);

/* On expose id au front admin, pas le champ interne _id de MongoDB. */
contactMessageSchema.set("toJSON", {
  versionKey: false,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
  },
});

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

export default ContactMessage;
