import express from "express";
import {
  createDoc,
  getDocs,
  getDoc,
  updateDoc,
  shareDoc,
  deleteDoc,
  getVersions,
  revertVersion,
} from "../controllers/docController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//  CREATE
router.post("/", protect, createDoc);

//  GET ALL
router.get("/", protect, getDocs);

//  IMPORTANT: specific routes FIRST
router.get("/:id/versions", protect, getVersions);
router.post("/:id/revert", protect, revertVersion);

// GET SINGLE
router.get("/:id", protect, getDoc);

//  UPDATE
router.put("/:id", protect, updateDoc);

//  SHARE
router.post("/:id/share", protect, shareDoc);

//  DELETE
router.delete("/:id", protect, deleteDoc);

export default router;
