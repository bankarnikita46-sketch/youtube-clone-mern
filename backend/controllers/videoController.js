import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

export const getVideos = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: "i" };
    if (category && category !== "All") filter.category = category;
    const videos = await Video.find(filter)
      .populate("uploader", "username avatar")
      .populate("channelId", "channelName")
      .sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("uploader", "username avatar")
      .populate("channelId", "channelName subscribers channelBanner");
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createVideo = async (req, res) => {
  try {
    const { title, description, thumbnailUrl, videoUrl, category, channelId } = req.body;
    if (!title || !thumbnailUrl || !videoUrl)
      return res.status(400).json({ message: "Title, thumbnail and video URL required" });

    const video = await Video.create({
      title,
      description,
      thumbnailUrl,
      videoUrl,
      category,
      channelId,
      uploader: req.user._id,
    });
    if (channelId) {
      await Channel.findByIdAndUpdate(channelId, { $push: { videos: video._id } });
    }
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    if (video.uploader.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    Object.assign(video, req.body);
    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    if (video.uploader.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    await video.deleteOne();
    res.json({ message: "Video deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    const uid = req.user._id.toString();
    video.dislikes = video.dislikes.filter((u) => u.toString() !== uid);
    if (video.likes.some((u) => u.toString() === uid)) {
      video.likes = video.likes.filter((u) => u.toString() !== uid);
    } else {
      video.likes.push(req.user._id);
    }
    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    const uid = req.user._id.toString();
    video.likes = video.likes.filter((u) => u.toString() !== uid);
    if (video.dislikes.some((u) => u.toString() === uid)) {
      video.dislikes = video.dislikes.filter((u) => u.toString() !== uid);
    } else {
      video.dislikes.push(req.user._id);
    }
    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
