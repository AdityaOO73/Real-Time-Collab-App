import mongoose from "mongoose";

const docSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Untitled",
    },

    content: {
      type: String,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["editor", "viewer"],
          default: "viewer",
        },
      },
    ],

    versions: [
      {
        content: String,
        timestamp: { type: Date, default: Date.now },
        editedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        editorName: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Document", docSchema);
