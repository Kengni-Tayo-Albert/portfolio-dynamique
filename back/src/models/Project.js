import mongoose from "mongoose";

/* Project représente une réalisation affichée sur l'accueil et la page Projets. */
const projectSchema = new mongoose.Schema(
  {
    sourceId: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    github: {
      type: String,
      required: true,
      trim: true,
    },
    demo: {
      type: String,
      required: true,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/* toJSON expose un id lisible côté front et masque les champs internes MongoDB. */
projectSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
  },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
