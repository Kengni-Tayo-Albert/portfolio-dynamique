import mongoose from "mongoose";

/* Petits schemas qui composent le CV. */
/* hero contient l'identité principale affichée en haut de la page CV. */
const heroSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

/* contactSchema décrit une ligne de contact avec son icône, son texte et son lien. */
const contactSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    href: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

/* identity regroupe les informations personnelles rapides du CV. */
const identitySchema = new mongoose.Schema(
  {
    age: {
      type: String,
      required: true,
      trim: true,
    },
    contacts: {
      type: [contactSchema],
      default: [],
    },
  },
  { _id: false }
);

/* iconLabelSchema sert aux listes simples qui associent une icône à un libellé. */
const iconLabelSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

/* formationSchema structure une entrée du parcours académique. */
const formationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    place: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    detail: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

/* experienceSchema structure une expérience professionnelle et ses missions. */
const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    place: {
      type: String,
      required: true,
      trim: true,
    },
    missions: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

/* Schema principal du CV en base. */
const profileCvSchema = new mongoose.Schema(
  {
    hero: {
      type: heroSchema,
      required: true,
    },
    identity: {
      type: identitySchema,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    softSkills: {
      type: [String],
      default: [],
    },
    languages: {
      type: [String],
      default: [],
    },
    hobbies: {
      type: [iconLabelSchema],
      default: [],
    },
    formations: {
      type: [formationSchema],
      default: [],
    },
    experiences: {
      type: [experienceSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/* Nettoyage de la reponse envoyee au front. */
profileCvSchema.set("toJSON", {
  versionKey: false,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
  },
});

const ProfileCv = mongoose.model("ProfileCv", profileCvSchema);

export default ProfileCv;
