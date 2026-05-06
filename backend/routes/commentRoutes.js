import express from "express";
import {
  getComments,
  addComment,
  editComment,
  deleteComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/:videoId", getComments);
router.post("/:videoId", protect, addComment);
router.put("/:commentId", protect, editComment);
router.delete("/:commentId", protect, deleteComment);
export default router;
