export default function Loading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200 rounded-lg aspect-square"
        />
      ))}
    </div>
  );
}
