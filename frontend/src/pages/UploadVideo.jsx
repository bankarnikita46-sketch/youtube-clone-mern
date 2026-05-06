import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const cats = ["Music","Gaming","Movies","News","Sports","Learning","Comedy","Tech","Vlogs","Cooking"];

export default function UploadVideo() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    videoUrl: "",
    category: "Music",
    channelId: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/auth/me");
      setChannels(data.channels || []);
      if (data.channels?.[0])
        setForm((f) => ({ ...f, channelId: data.channels[0]._id || data.channels[0] }));
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.videoUrl || !form.thumbnailUrl)
      return toast.error("Title, video URL and thumbnail are required");
    if (!form.channelId)
      return toast.error("Create a channel first");
    setLoading(true);
    try {
      const { data } = await api.post("/videos", form);
      toast.success("Video uploaded!");
      navigate(`/video/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (channels.length === 0)
    return (
      <div className="p-10 text-center">
        <p className="mb-4">You need a channel to upload videos.</p>
        <button
          onClick={() => navigate("/create-channel")}
          className="bg-blue-600 px-5 py-2 rounded-full"
        >
          Create channel
        </button>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload a video</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-ytgray rounded-lg px-4 py-2.5"
        />
        <textarea
          placeholder="Description"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full bg-ytgray rounded-lg px-4 py-2.5"
        />
        <input
          placeholder="Video URL (YouTube link or .mp4)"
          value={form.videoUrl}
          onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
          className="w-full bg-ytgray rounded-lg px-4 py-2.5"
        />
        <input
          placeholder="Thumbnail image URL"
          value={form.thumbnailUrl}
          onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
          className="w-full bg-ytgray rounded-lg px-4 py-2.5"
        />
        <div className="grid grid-cols-2 gap-3">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="bg-ytgray rounded-lg px-4 py-2.5"
          >
            {cats.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={form.channelId}
            onChange={(e) => setForm({ ...form, channelId: e.target.value })}
            className="bg-ytgray rounded-lg px-4 py-2.5"
          >
            {channels.map((c) => (
              <option key={c._id || c} value={c._id || c}>
                {c.channelName || "Channel"}
              </option>
            ))}
          </select>
        </div>
        <button
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-full font-medium disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
