import { Link } from "react-router-dom";
import { Home, Flame, Music, Film, Gamepad2, Newspaper, Trophy, Lightbulb, User } from "lucide-react";

const items = [
  { icon: Home, label: "Home", to: "/" },
  { icon: Flame, label: "Trending", to: "/" },
  { icon: Music, label: "Music", to: "/" },
  { icon: Film, label: "Movies", to: "/" },
  { icon: Gamepad2, label: "Gaming", to: "/" },
  { icon: Newspaper, label: "News", to: "/" },
  { icon: Trophy, label: "Sports", to: "/" },
  { icon: Lightbulb, label: "Learning", to: "/" },
  { icon: User, label: "You", to: "/" },
];

export default function Sidebar({ open }) {
  return (
    <aside
      className={`fixed top-14 left-0 bottom-0 z-30 bg-ytdark border-r border-ytgray transition-all duration-200 ${
        open ? "w-60" : "w-20"
      } hidden md:block overflow-y-auto no-scrollbar`}
    >
      <nav className="py-2">
        {items.map((it) => (
          <Link
            key={it.label}
            to={it.to}
            className={`flex items-center gap-6 px-4 py-3 hover:bg-ytgray ${
              open ? "" : "flex-col gap-1 text-xs"
            }`}
          >
            <it.icon size={open ? 22 : 24} />
            <span className={open ? "text-sm" : "text-[10px]"}>{it.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
