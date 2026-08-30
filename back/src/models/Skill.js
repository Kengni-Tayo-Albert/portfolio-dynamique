import mongoose from "mongoose";

/* Une competence individuelle stocke son libelle et la cle d'icone utilisee par le front. */
const skillItemSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

/* Un groupe rassemble les competences par categorie visuelle : front, back, outils ou soft skills. */
const skillGroupSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    items: {
      type: [skillItemSchema],
      default: [],
    },
  },
  { _id: false }
);

/* Les statistiques affichent des chiffres courts sur la page Competences. */
const skillStatSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

/* Skill stocke le contenu complet de la page Competences dans un seul document versionne par date. */
const skillSchema = new mongoose.Schema(
  {
    groups: {
      type: [skillGroupSchema],
      default: [],
    },
    stats: {
      type: [skillStatSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/* toJSON nettoie la reponse envoyee au front en remplacant _id par id. */
skillSchema.set("toJSON", {
  versionKey: false,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
  },
});

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
