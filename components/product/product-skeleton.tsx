export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-[18px] border border-[#ECE7E2] overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-[#ECE7E2]" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-[#ECE7E2] rounded" />
        <div className="h-5 w-40 bg-[#ECE7E2] rounded" />
        <div className="h-3 w-28 bg-[#ECE7E2] rounded" />
        <div className="h-4 w-20 bg-[#ECE7E2] rounded" />
      </div>
    </div>
  );
}
