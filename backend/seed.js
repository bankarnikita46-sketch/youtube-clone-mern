// =============================================
// SEED SCRIPT — YouTube Clone Sample Data
// =============================================
// Run this from the backend folder:
//   node seed.js
// =============================================

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// ── Inline schemas (no import path issues) ──
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  avatar: { type: String, default: "" },
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
}, { timestamps: true });

const channelSchema = new mongoose.Schema({
  channelName: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  description: { type: String, default: "" },
  channelBanner: { type: String, default: "" },
  subscribers: { type: Number, default: 0 },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
}, { timestamps: true });

const videoSchema = new mongoose.Schema({
  title: String,
  description: { type: String, default: "" },
  thumbnailUrl: String,
  videoUrl: String,
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
  category: { type: String, default: "All" },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  uploadDate: { type: Date, default: Date.now },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  text: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
}, { timestamps: true });

const User    = mongoose.models.User    || mongoose.model("User",    userSchema);
const Channel = mongoose.models.Channel || mongoose.model("Channel", channelSchema);
const Video   = mongoose.models.Video   || mongoose.model("Video",   videoSchema);
const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);

// ── Sample Data ────────────────────────────

const usersData = [
  { username: "JohnDoe",    email: "john@example.com",    password: "password123" },
  { username: "TechGuru",   email: "tech@example.com",    password: "password123" },
  { username: "MusicLover", email: "music@example.com",   password: "password123" },
];

const videosData = [
  {
    title: "Learn React in 30 Minutes",
    description: "A quick tutorial to get started with React. We cover components, props, state, and hooks in this beginner-friendly guide.",
    thumbnailUrl: "https://img.youtube.com/vi/Tn6-PIqc4UM/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
    category: "Learning",
    views: 15200,
  },
  {
    title: "JavaScript Full Course for Beginners",
    description: "Complete JavaScript tutorial covering all fundamentals — variables, functions, arrays, objects, async/await and more.",
    thumbnailUrl: "https://img.youtube.com/vi/PkZNo7MFNFg/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
    category: "Learning",
    views: 98400,
  },
  {
    title: "Node.js Crash Course",
    description: "Learn Node.js in this crash course. We build a simple REST API with Express and MongoDB from scratch.",
    thumbnailUrl: "https://img.youtube.com/vi/fBNz5xF-Kx4/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
    category: "Tech",
    views: 45300,
  },
  {
    title: "Lofi Hip Hop Radio — Beats to Relax/Study",
    description: "Chill lofi beats to help you focus, relax or study. Perfect background music for coding sessions.",
    thumbnailUrl: "https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    category: "Music",
    views: 1200000,
  },
  {
    title: "Top 10 Gaming Moments of 2024",
    description: "The most epic gaming moments compilation from 2024. Featuring clips from popular games and streamers.",
    thumbnailUrl: "https://img.youtube.com/vi/V-_O7nl0Ii0/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=V-_O7nl0Ii0",
    category: "Gaming",
    views: 320000,
  },
  {
    title: "MongoDB Tutorial for Beginners",
    description: "Complete MongoDB tutorial — learn how to use MongoDB with Node.js, Mongoose, CRUD operations and more.",
    thumbnailUrl: "https://img.youtube.com/vi/ofme2o29ngU/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=ofme2o29ngU",
    category: "Tech",
    views: 67800,
  },
  {
    title: "Funny Cats Compilation 2024",
    description: "The funniest cat videos of 2024 compiled in one video. Guaranteed to make you laugh!",
    thumbnailUrl: "https://img.youtube.com/vi/tntOCGkgt98/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=tntOCGkgt98",
    category: "Comedy",
    views: 540000,
  },
  {
    title: "Cooking Pasta Like a Pro — Italian Chef",
    description: "Learn how to cook authentic Italian pasta from a professional chef. Simple ingredients, incredible taste.",
    thumbnailUrl: "https://img.youtube.com/vi/bJUiWdM__Qw/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=bJUiWdM__Qw",
    category: "Cooking",
    views: 230000,
  },
  {
    title: "India vs Australia — Cricket Highlights",
    description: "Match highlights from the exciting India vs Australia cricket series. Best shots, wickets and moments.",
    thumbnailUrl: "https://img.youtube.com/vi/LDU_Txk06tM/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=LDU_Txk06tM",
    category: "Sports",
    views: 875000,
  },
  {
    title: "World News Today — Top Stories",
    description: "Today's top news stories from around the world. Stay informed with the latest updates.",
    thumbnailUrl: "https://img.youtube.com/vi/9Auq9mYxFEE/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=9Auq9mYxFEE",
    category: "News",
    views: 125000,
  },
  {
    title: "CSS Flexbox and Grid Full Tutorial",
    description: "Master CSS Flexbox and Grid layouts with this comprehensive tutorial. Build modern responsive layouts easily.",
    thumbnailUrl: "https://img.youtube.com/vi/u044iM9xsWU/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=u044iM9xsWU",
    category: "Learning",
    views: 38900,
  },
  {
    title: "My Day in Mumbai — City Vlog",
    description: "Join me for a day exploring the streets, food, and culture of Mumbai! An amazing city vlog.",
    thumbnailUrl: "https://img.youtube.com/vi/bKMSHGGFaR0/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=bKMSHGGFaR0",
    category: "Vlogs",
    views: 91000,
  },
];

const commentsData = [
  "Great video! Very helpful 👍",
  "This is exactly what I was looking for, thank you!",
  "Amazing content, keep it up!",
  "I learned so much from this video.",
  "Can you make a part 2 of this?",
  "This channel is underrated!",
  "Watched this 3 times already 😄",
  "Best explanation on YouTube!",
];

// ── Main Seed Function ──────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Clear existing data
    await User.deleteMany({});
    await Channel.deleteMany({});
    await Video.deleteMany({});
    await Comment.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create Users
    const createdUsers = [];
    for (const u of usersData) {
      const hashed = await bcrypt.hash(u.password, 10);
      const user = await User.create({ ...u, password: hashed });
      createdUsers.push(user);
    }
    console.log(`👤 Created ${createdUsers.length} users`);

    // Create Channels (one per user)
    const channelInfos = [
      { channelName: "Code with John",   description: "Coding tutorials and tech reviews by John.",     subscribers: 5200  },
      { channelName: "TechGuru Official", description: "Deep dives into tech, programming and gadgets.", subscribers: 12400 },
      { channelName: "Music & Chill",    description: "Music, beats, and entertainment for everyone.",   subscribers: 34000 },
    ];

    const createdChannels = [];
    for (let i = 0; i < createdUsers.length; i++) {
      const ch = await Channel.create({
        ...channelInfos[i],
        owner: createdUsers[i]._id,
        channelBanner: "https://picsum.photos/seed/channel" + i + "/1200/200",
      });
      await User.findByIdAndUpdate(createdUsers[i]._id, { $push: { channels: ch._id } });
      createdChannels.push(ch);
    }
    console.log(`📺 Created ${createdChannels.length} channels`);

    // Create Videos — distribute among channels/users
    const createdVideos = [];
    for (let i = 0; i < videosData.length; i++) {
      const uploaderIdx = i % createdUsers.length;
      const channelIdx  = i % createdChannels.length;

      const video = await Video.create({
        ...videosData[i],
        uploader:  createdUsers[uploaderIdx]._id,
        channelId: createdChannels[channelIdx]._id,
      });

      // Add video to channel
      await Channel.findByIdAndUpdate(createdChannels[channelIdx]._id, {
        $push: { videos: video._id },
      });

      createdVideos.push(video);
    }
    console.log(`🎬 Created ${createdVideos.length} videos`);

    // Create Comments — 2 per video
    let commentCount = 0;
    for (let i = 0; i < createdVideos.length; i++) {
      for (let j = 0; j < 2; j++) {
        const userIdx = (i + j) % createdUsers.length;
        const text    = commentsData[(i + j) % commentsData.length];
        const comment = await Comment.create({
          text,
          user:  createdUsers[userIdx]._id,
          video: createdVideos[i]._id,
        });
        await Video.findByIdAndUpdate(createdVideos[i]._id, {
          $push: { comments: comment._id },
        });
        commentCount++;
      }
    }
    console.log(`💬 Created ${commentCount} comments`);

    console.log("\n🎉 Seed complete! Login with:");
    console.log("   Email: john@example.com   | Password: password123");
    console.log("   Email: tech@example.com   | Password: password123");
    console.log("   Email: music@example.com  | Password: password123");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
}

seed();