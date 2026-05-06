import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: "Comment cannot be empty" });
    const comment = await Comment.create({
      text,
      user: req.user._id,
      video: req.params.videoId,
    });
    await Video.findByIdAndUpdate(req.params.videoId, { $push: { comments: comment._id } });
    const populated = await comment.populate("user", "username avatar");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    comment.text = req.body.text || comment.text;
    await comment.save();
    res.json(await comment.populate("user", "username avatar"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    await Video.findByIdAndUpdate(comment.video, { $pull: { comments: comment._id } });
    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
