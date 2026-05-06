export default function EmptyState({ title = "Nothing here", message = "Try different filters." }) {
  return (
    <div className="text-center py-20 text-gray-400">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm">{message}</p>
    </div>
  );
}
