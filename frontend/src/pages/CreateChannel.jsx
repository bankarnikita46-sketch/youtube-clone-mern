import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function CreateChannel() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ channelName: "", description: "", channelBanner: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.channelName.trim()) return toast.error("Channel name required");
    setLoading(true);
    try {
      const { data } = await api.post("/channels", form);
      updateUser({ ...user, channels: [...(user.channels || []), data._id] });
      toast.success("Channel created!");
      navigate(`/channel/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create your channel</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          placeholder="Channel name"
          value={form.channelName}
          onChange={(e) => setForm({ ...form, channelName: e.target.value })}
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
          placeholder="Banner image URL"
          value={form.channelBanner}
          onChange={(e) => setForm({ ...form, channelBanner: e.target.value })}
          className="w-full bg-ytgray rounded-lg px-4 py-2.5"
        />
        <button
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-full font-medium disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create channel"}
        </button>
      </form>
    </div>
  );
}
