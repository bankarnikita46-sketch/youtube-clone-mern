const categories = [
  "All", "Music", "Gaming", "Movies", "News", "Sports",
  "Learning", "Comedy", "Tech", "Vlogs", "Cooking",
];

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="sticky top-14 bg-ytdark z-20 px-6 py-3 border-b border-ytgray">
      <div className="flex gap-3 overflow-x-auto no-scrollbar">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              active === c ? "bg-white text-black" : "bg-ytgray hover:bg-ythover"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
