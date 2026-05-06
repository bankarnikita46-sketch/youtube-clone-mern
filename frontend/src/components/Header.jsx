import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, Video, Bell, LogOut, Youtube } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Header({ onToggleSidebar, search, setSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-14 bg-ytdark border-b border-ytgray flex items-center px-4 gap-4">
      <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-ytgray">
        <Menu size={22} />
      </button>
      <Link to="/" className="flex items-center gap-1">
        <Youtube className="text-ytred" size={28} />
        <span className="font-bold text-lg hidden sm:inline">YouTube</span>
      </Link>

      <div className="flex-1 max-w-2xl mx-auto hidden sm:flex">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="flex-1 bg-ytdark border border-ytgray rounded-l-full px-4 py-2 focus:outline-none focus:border-blue-500"
        />
        <button className="bg-ytgray border border-ytgray rounded-r-full px-5 hover:bg-ythover">
          <Search size={18} />
        </button>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {user ? (
          <>
            <Link to="/upload" className="p-2 rounded-full hover:bg-ytgray" title="Upload">
              <Video size={22} />
            </Link>
            <button className="p-2 rounded-full hover:bg-ytgray hidden sm:block">
              <Bell size={22} />
            </button>
            <Link
              to={user.channels?.[0] ? `/channel/${user.channels[0]}` : "/create-channel"}
              className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-semibold uppercase"
            >
              {user.username?.[0]}
            </Link>
            <button onClick={handleLogout} className="p-2 rounded-full hover:bg-ytgray" title="Logout">
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="border border-blue-500 text-blue-400 hover:bg-blue-500/10 px-3 py-1.5 rounded-full text-sm font-medium"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
