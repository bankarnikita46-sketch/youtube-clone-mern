import Channel from "../models/Channel.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;
    if (!channelName) return res.status(400).json({ message: "Channel name required" });
    const channel = await Channel.create({
      channelName,
      description,
      channelBanner,
      owner: req.user._id,
    });
    await User.findByIdAndUpdate(req.user._id, { $push: { channels: channel._id } });
    res.status(201).json(channel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate("owner", "username avatar");
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    const videos = await Video.find({ channelId: channel._id }).sort({ createdAt: -1 });
    res.json({ channel, videos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    if (channel.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    Object.assign(channel, req.body);
    await channel.save();
    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
