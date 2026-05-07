import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import toast from "react-hot-toast";
import { Trash2, Pencil, X, Settings } from "lucide-react";

const cats = ["Music","Gaming","Movies","News","Sports","Learning","Comedy","Tech","Vlogs","Cooking"];

export default function Channel() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Video modal state
  const [editVideo, setEditVideo] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // Edit Channel modal state
  const [showEditChannel, setShowEditChannel] = useState(false);
  const [channelForm, setChannelForm] = useState({});
  const [channelLoading, setChannelLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get(`/channels/${id}`);
      setData(r.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ── Video handlers ──────────────────────────────
  const handleDelete = async (vid) => {
    if (!confirm("Delete this video?")) return;
    await api.delete(`/videos/${vid}`);
    toast.success("Video deleted");
    load();
  };

  const openEdit = (v) => {
    setEditVideo(v);
    setEditForm({
      title: v.title,
      description: v.description,
      thumbnailUrl: v.thumbnailUrl,
      videoUrl: v.videoUrl,
      category: v.category,
    });
  };

  const handleEditSave = async () => {
    if (!editForm.title || !editForm.videoUrl || !editForm.thumbnailUrl) {
      toast.error("Title, Video URL and Thumbnail are required");
      return;
    }
    setEditLoading(true);
    try {
      await api.put(`/videos/${editVideo._id}`, editForm);
      toast.success("Video updated!");
      setEditVideo(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setEditLoading(false);
    }
  };

  // ── Channel handlers ────────────────────────────
  const openEditChannel = () => {
    setChannelForm({
      channelName: data.channel.channelName,
      description: data.channel.description,
      channelBanner: data.channel.channelBanner,
    });
    setShowEditChannel(true);
  };

  const handleChannelSave = async () => {
    if (!channelForm.channelName?.trim()) {
      toast.error("Channel name is required");
      return;
    }
    setChannelLoading(true);
    try {
      await api.put(`/channels/${id}`, channelForm);
      toast.success("Channel updated!");
      setShowEditChannel(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setChannelLoading(false);
    }
  };

  // ────────────────────────────────────────────────
  if (loading) return <Spinner />;
  if (!data) return <EmptyState title="Channel not found" />;

  const { channel, videos } = data;
  const isOwner =
    user &&
    channel.owner &&
    (user._id === channel.owner._id ||
      user._id === channel.owner._id?.toString() ||
      user.id === channel.owner._id ||
      user._id?.toString() === channel.owner._id?.toString());

  return (
    <div className="pb-10">
      {/* ── Channel Banner ── */}
      <div
        className="h-40 md:h-60 w-full bg-cover bg-center bg-gradient-to-r from-purple-900 to-blue-900"
        style={
          channel.channelBanner
            ? { backgroundImage: `url(${channel.channelBanner})` }
            : undefined
        }
      />

      {/* ── Channel Info ── */}
      <div className="px-6 py-5 flex items-center gap-5 border-b border-ytgray">
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold uppercase shrink-0">
          {channel.channelName[0]}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold">{channel.channelName}</h1>
          <p className="text-sm text-gray-400 mt-1">
            {channel.subscribers} subscribers · {videos.length} videos
          </p>
          <p className="text-sm mt-2 text-gray-300">{channel.description}</p>
        </div>

        {/* Owner buttons */}
        {isOwner && (
          <div className="flex gap-2 shrink-0">
            {/* Edit Channel button */}
            <button
              onClick={openEditChannel}
              className="flex items-center gap-2 bg-ytgray hover:bg-ythover px-4 py-2 rounded-full text-sm font-medium transition"
            >
              <Settings size={16} />
              <span className="hidden sm:inline">Edit Channel</span>
            </button>
            {/* Upload Video button */}
            <Link
              to="/upload"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-medium transition"
            >
              + Upload
            </Link>
          </div>
        )}
      </div>

      {/* ── Videos Grid ── */}
      {videos.length === 0 ? (
        <EmptyState
          title="No videos yet"
          message={isOwner ? "Upload your first video!" : ""}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-6">
          {videos.map((v) => (
            <div key={v._id} className="relative">
              <VideoCard
                video={{ ...v, channelId: { channelName: channel.channelName } }}
              />
              {isOwner && (
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => openEdit(v)}
                    className="p-2 bg-black/70 rounded-full hover:bg-blue-600 transition"
                    title="Edit video"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(v._id)}
                    className="p-2 bg-black/70 rounded-full hover:bg-red-600 transition"
                    title="Delete video"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════
          Edit VIDEO Modal
      ══════════════════════════════════════════ */}
      {editVideo && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-[#1f1f1f] rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Edit Video</h2>
              <button
                onClick={() => setEditVideo(null)}
                className="p-2 rounded-full hover:bg-ytgray"
              >
                <X size={20} />
              </button>
            </div>

            <input
              placeholder="Title *"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full bg-ytdark border border-ytgray rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
            />
            <textarea
              placeholder="Description"
              rows={3}
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full bg-ytdark border border-ytgray rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
            />
            <input
              placeholder="Video URL *"
              value={editForm.videoUrl}
              onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
              className="w-full bg-ytdark border border-ytgray rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
            />
            <input
              placeholder="Thumbnail URL *"
              value={editForm.thumbnailUrl}
              onChange={(e) => setEditForm({ ...editForm, thumbnailUrl: e.target.value })}
              className="w-full bg-ytdark border border-ytgray rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
            />
            <select
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              className="w-full bg-ytdark border border-ytgray rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
            >
              {cats.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setEditVideo(null)}
                className="px-5 py-2 rounded-full border border-ytgray hover:bg-ytgray text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={editLoading}
                className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          Edit CHANNEL Modal
      ══════════════════════════════════════════ */}
      {showEditChannel && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-[#1f1f1f] rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Edit Channel</h2>
              <button
                onClick={() => setShowEditChannel(false)}
                className="p-2 rounded-full hover:bg-ytgray"
              >
                <X size={20} />
              </button>
            </div>

            {/* Channel Name */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Channel Name *</label>
              <input
                placeholder="Channel Name"
                value={channelForm.channelName}
                onChange={(e) =>
                  setChannelForm({ ...channelForm, channelName: e.target.value })
                }
                className="w-full bg-ytdark border border-ytgray rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Description</label>
              <textarea
                placeholder="Tell viewers about your channel..."
                rows={3}
                value={channelForm.description}
                onChange={(e) =>
                  setChannelForm({ ...channelForm, description: e.target.value })
                }
                className="w-full bg-ytdark border border-ytgray rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Banner URL */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Banner Image URL</label>
              <input
                placeholder="https://example.com/banner.jpg"
                value={channelForm.channelBanner}
                onChange={(e) =>
                  setChannelForm({ ...channelForm, channelBanner: e.target.value })
                }
                className="w-full bg-ytdark border border-ytgray rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500"
              />
              {/* Banner preview */}
              {channelForm.channelBanner && (
                <img
                  src={channelForm.channelBanner}
                  alt="Banner preview"
                  className="mt-2 w-full h-20 object-cover rounded-lg border border-ytgray"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setShowEditChannel(false)}
                className="px-5 py-2 rounded-full border border-ytgray hover:bg-ytgray text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleChannelSave}
                disabled={channelLoading}
                className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
              >
                {channelLoading ? "Saving..." : "Save Channel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}