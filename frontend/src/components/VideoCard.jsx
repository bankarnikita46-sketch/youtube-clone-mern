import { Link } from "react-router-dom";

const formatViews = (n) =>
  n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : n;

const timeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
  return `${Math.floor(s / 2592000)}mo ago`;
};

export default function VideoCard({ video }) {
  return (
    <Link to={`/video/${video._id}`} className="group cursor-pointer">
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-ytgray">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.02] transition"
        />
      </div>
      <div className="flex gap-3 mt-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold uppercase shrink-0">
          {video.uploader?.username?.[0] || "U"}
        </div>
        <div className="min-w-0">
          <h3 className="font-medium line-clamp-2 text-sm">{video.title}</h3>
          <p className="text-xs text-gray-400 mt-1">
            {video.channelId?.channelName || video.uploader?.username}
          </p>
          <p className="text-xs text-gray-400">
            {formatViews(video.views)} views · {timeAgo(video.uploadDate || video.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
