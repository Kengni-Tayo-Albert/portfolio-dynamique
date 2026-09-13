import mongoose from "mongoose";

/* ==========================================================================
   1. SCHEMAS INTERNES DES COMPETENCES
   Ces schemas decrivent une competence, un groupe et une statistique.
========================================================================== */
/* Une compétence individuelle stocke son libellé et la clé d'icône utilisée par le front. */
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

/* Un groupe rassemble les compétences par catégorie visuelle : front, back, outils ou soft skills. */
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

/* Les statistiques affichent des chiffres courts sur la page Compétences. */
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

/* ==========================================================================
   2. SCHEMA PRINCIPAL MONGOOSE
   Un seul document contient les groupes de competences et les statistiques.
========================================================================== */
/* Skill stocke le contenu complet de la page Compétences dans un seul document versionné par date. */
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

/* ==========================================================================
   3. FORMAT DE REPONSE POUR LE FRONT
   On remplace _id par id pour simplifier l'utilisation cote React.
========================================================================== */
/* toJSON nettoie la réponse envoyée au front en remplaçant _id par id. */
skillSchema.set("toJSON", {
  versionKey: false,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
  },
});

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
