import { useEffect, useState } from "react";
import api from "../services/api";
import VideoCard from "../components/VideoCard";
import CategoryFilter from "../components/CategoryFilter";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

export default function Home({ search }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (category !== "All") params.category = category;
        const { data } = await api.get("/videos", { params });
        setVideos(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(fetchVideos, 250);
    return () => clearTimeout(t);
  }, [search, category]);

  return (
    <>
      <CategoryFilter active={category} onChange={setCategory} />
      {loading ? (
        <Spinner />
      ) : videos.length === 0 ? (
        <EmptyState title="No videos found" message="Try a different search or category." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-6">
          {videos.map((v) => (
            <VideoCard key={v._id} video={v} />
          ))}
        </div>
      )}
    </>
  );
}
