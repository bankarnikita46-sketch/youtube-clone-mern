import { Link, useLocation } from "react-router-dom";
import { Home, Flame, Music, Film, Gamepad2, Newspaper, Trophy, Lightbulb, User, X } from "lucide-react";

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

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  const NavLinks = ({ mobile = false }) => (
    <nav className="py-2">
      {items.map((it) => {
        const active = location.pathname === it.to && it.to === "/";
        return (
          <Link
            key={it.label}
            to={it.to}
            onClick={mobile ? onClose : undefined}
            className={`flex items-center gap-6 px-4 py-3 transition-colors rounded-lg mx-1
              ${active ? "bg-ytgray font-medium" : "hover:bg-ytgray"}
              ${!mobile && !open ? "flex-col gap-1 text-xs" : ""}
            `}
          >
            <it.icon size={mobile || open ? 22 : 24} />
            <span className={!mobile && !open ? "text-[10px]" : "text-sm"}>
              {it.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed top-14 left-0 bottom-0 z-30 bg-ytdark border-r border-ytgray transition-all duration-200
          ${open ? "w-60" : "w-20"}
          hidden md:block overflow-y-auto no-scrollbar`}
      >
        <NavLinks />
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-ytdark border-r border-ytgray
          transition-transform duration-300 md:hidden overflow-y-auto no-scrollbar
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-3 px-4 h-14 border-b border-ytgray">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-ytgray"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
          <span className="font-bold text-lg">YouTube</span>
        </div>
        <NavLinks mobile />
      </aside>
    </>
  );
}
