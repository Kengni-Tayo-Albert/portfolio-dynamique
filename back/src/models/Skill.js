import mongoose from "mongoose";

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

skillSchema.set("toJSON", {
  versionKey: false,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
  },
});

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
