import Document from "../models/Document.js";
import User from "../models/User.js";
import mongoose from "mongoose";

//  CREATE DOC
export const createDoc = async (req, res) => {
  try {
    const doc = await Document.create({
      title: "Untitled",
      content: "",
      owner: new mongoose.Types.ObjectId(req.user),
    });

    res.json(doc);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//  GET ALL DOCS (FIXED)
export const getDocs = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user);

    const docs = await Document.find({
      $or: [
        { owner: userId },
        {
          collaborators: {
            $elemMatch: { user: userId },
          },
        },
      ],
    }).sort({ updatedAt: -1 });

    res.json(docs);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//  GET SINGLE DOC
export const getDoc = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) return res.status(404).json("Document not found");

    const userId = req.user.toString();

    const isOwner = doc.owner.toString() === userId;

    const collaborator = doc.collaborators.find(
      (c) => c.user.toString() === userId,
    );

    if (!isOwner && !collaborator) {
      return res.status(403).json("Access denied to this document");
    }

    res.json({
      ...doc.toObject(),
      role: isOwner ? "editor" : collaborator.role,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//  UPDATE DOC
export const updateDoc = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) return res.status(404).json("Document not found");

    const userId = req.user.toString();

    const isOwner = doc.owner.toString() === userId;

    const collaborator = doc.collaborators.find(
      (c) => c.user.toString() === userId,
    );

    const role = isOwner ? "editor" : collaborator?.role;

    if (role !== "editor") {
      return res.status(403).json("No edit permission ");
    }

    const newContent = req.body.content ?? doc.content;

    // SAVE VERSION ONLY IF CONTENT CHANGED
    if (newContent !== doc.content) {
      doc.versions.push({
        content: doc.content,
        editedBy: req.user,
        editorName: req.userName,
      });
    }

    doc.content = newContent;
    doc.title = req.body.title ?? doc.title;

    await doc.save();

    res.json(doc);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//  DELETE DOC

export const deleteDoc = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) return res.status(404).json("Not found");

    //  FIX HERE
    if (doc.owner.toString() !== req.user.toString()) {
      return res.status(403).json("Only owner can delete ");
    }

    await doc.deleteOne();

    res.json("Deleted successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const getVersions = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) return res.status(404).json("Not found");

    res.json(doc.versions.reverse());
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const revertVersion = async (req, res) => {
  try {
    const { content } = req.body;

    const doc = await Document.findById(req.params.id);

    if (!doc) return res.status(404).json("Not found");

    // save current before revert
    doc.versions.push({ content: doc.content });

    doc.content = content;

    await doc.save();

    res.json(doc);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

//  SHARE DOC
export const shareDoc = async (req, res) => {
  try {
    const { email, role } = req.body;

    const doc = await Document.findById(req.params.id);

    if (!doc) return res.status(404).json("Document not found");

    if (doc.owner.toString() !== req.user.toString()) {
      return res.status(403).json("Only owner can share ");
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json("User not found");

    const exists = doc.collaborators.find(
      (c) => c.user.toString() === user._id.toString(),
    );

    if (!exists) {
      doc.collaborators.push({
        user: user._id,
        role: role || "viewer",
      });
    }

    await doc.save();

    res.json("User added successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
};
