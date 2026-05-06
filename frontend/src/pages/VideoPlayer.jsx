import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";

export default function VideoPlayer() {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [v, c] = await Promise.all([api.get(`/videos/${id}`), api.get(`/comments/${id}`)]);
      setVideo(v.data);
      setComments(c.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const requireAuth = () => {
    if (!user) {
      toast.error("Please sign in");
      return false;
    }
    return true;
  };

  const handleLike = async () => {
    if (!requireAuth()) return;
    const { data } = await api.put(`/videos/${id}/like`);
    setVideo({ ...video, likes: Array(data.likes).fill(0), dislikes: Array(data.dislikes).fill(0) });
  };
  const handleDislike = async () => {
    if (!requireAuth()) return;
    const { data } = await api.put(`/videos/${id}/dislike`);
    setVideo({ ...video, likes: Array(data.likes).fill(0), dislikes: Array(data.dislikes).fill(0) });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!requireAuth() || !text.trim()) return;
    const { data } = await api.post(`/comments/${id}`, { text });
    setComments([data, ...comments]);
    setText("");
  };

  const handleEdit = async (cid) => {
    const { data } = await api.put(`/comments/${cid}`, { text: editText });
    setComments(comments.map((c) => (c._id === cid ? data : c)));
    setEditingId(null);
  };

  const handleDelete = async (cid) => {
    await api.delete(`/comments/${cid}`);
    setComments(comments.filter((c) => c._id !== cid));
    toast.success("Comment deleted");
  };

  if (loading || !video) return <Spinner />;

  const isYouTube = video.videoUrl.includes("youtube.com") || video.videoUrl.includes("youtu.be");
  const ytId = isYouTube
    ? video.videoUrl.split(/v=|youtu\.be\//)[1]?.split(/[&?]/)[0]
    : null;

  return (
    <div className="grid lg:grid-cols-3 gap-6 p-4 md:p-6 max-w-screen-2xl">
      <div className="lg:col-span-2">
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden">
          {ytId ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${ytId}`}
              title={video.title}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video src={video.videoUrl} controls className="w-full h-full" />
          )}
        </div>

        <h1 className="text-xl font-bold mt-3">{video.title}</h1>

        <div className="flex flex-wrap items-center justify-between mt-3 gap-3">
          <Link to={`/channel/${video.channelId?._id || ""}`} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold uppercase">
              {video.uploader?.username?.[0]}
            </div>
            <div>
              <p className="font-medium">{video.channelId?.channelName || video.uploader?.username}</p>
              <p className="text-xs text-gray-400">
                {video.channelId?.subscribers || 0} subscribers
              </p>
            </div>
          </Link>
          <div className="flex items-center bg-ytgray rounded-full overflow-hidden">
            <button onClick={handleLike} className="flex items-center gap-2 px-4 py-2 hover:bg-ythover">
              <ThumbsUp size={18} /> {video.likes?.length || 0}
            </button>
            <span className="w-px h-6 bg-ythover" />
            <button onClick={handleDislike} className="flex items-center gap-2 px-4 py-2 hover:bg-ythover">
              <ThumbsDown size={18} /> {video.dislikes?.length || 0}
            </button>
          </div>
        </div>

        <div className="bg-ytgray rounded-xl p-4 mt-4">
          <p className="text-sm font-semibold">{video.views} views</p>
          <p className="text-sm whitespace-pre-wrap mt-2">{video.description}</p>
        </div>

        <section className="mt-6">
          <h2 className="font-semibold mb-3">{comments.length} Comments</h2>
          <form onSubmit={handleAdd} className="flex gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold uppercase">
              {user?.username?.[0] || "?"}
            </div>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-transparent border-b border-ythover focus:outline-none focus:border-white py-1"
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-4 rounded-full text-sm">Comment</button>
          </form>

          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c._id} className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center font-bold uppercase shrink-0">
                  {c.user?.username?.[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {c.user?.username}
                    <span className="text-gray-400 font-normal ml-2 text-xs">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  {editingId === c._id ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 bg-transparent border-b border-ythover focus:outline-none"
                      />
                      <button onClick={() => handleEdit(c._id)} className="text-blue-400 text-sm">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-gray-400 text-sm">Cancel</button>
                    </div>
                  ) : (
                    <p className="text-sm">{c.text}</p>
                  )}
                  {user?._id === c.user?._id && editingId !== c._id && (
                    <div className="flex gap-3 mt-1 text-xs text-gray-400">
                      <button
                        onClick={() => {
                          setEditingId(c._id);
                          setEditText(c.text);
                        }}
                        className="hover:text-white"
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDelete(c._id)} className="hover:text-red-500">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
