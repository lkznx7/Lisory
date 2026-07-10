import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  count: number;
}

export function StarRating({ rating, count }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={12}
            className={
              i <= Math.round(rating)
                ? "fill-[#D97D93] text-[#D97D93]"
                : "fill-[#F2DCDD] text-[#F2DCDD]"
            }
          />
        ))}
      </div>
      <span className="text-xs text-[#6E5A5D]">({count})</span>
    </div>
  );
}
