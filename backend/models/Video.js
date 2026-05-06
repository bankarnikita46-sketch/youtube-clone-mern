import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    thumbnailUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
    category: { type: String, default: "All" },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    uploadDate: { type: Date, default: Date.now },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
