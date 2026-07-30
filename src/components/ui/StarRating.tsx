import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  count?: number;
}

export function StarRating({
  rating,
  max = 5,
  size = "md",
  showValue = false,
  count,
}: StarRatingProps) {
  const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5

  const sizeClass = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size];

  return (
    <div className="flex items-center gap-1" role="img" aria-label={`Rating: ${rating} out of ${max} stars`}>
      <div className="flex">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i + 1 <= roundedRating;
          const halfFilled = !filled && i + 0.5 <= roundedRating;

          return (
            <div key={i} className="relative">
              <Star className={cn(sizeClass, "fill-gray-200 text-gray-200")} />
              {(filled || halfFilled) && (
                <div
                  className={cn(
                    "absolute inset-0 overflow-hidden",
                    halfFilled ? "w-[50%]" : "w-full"
                  )}
                >
                  <Star className={cn(sizeClass, "fill-amber-400 text-amber-400")} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-sm text-gray-400">({count})</span>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Interactive rating input
// ──────────────────────────────────────────────
interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export function RatingInput({ value, onChange, max = 5 }: RatingInputProps) {
  return (
    <div className="flex items-center gap-0.5" role="radiogroup" aria-label="Rating">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === starValue}
            aria-label={`${starValue} star${starValue !== 1 ? "s" : ""}`}
            onClick={() => onChange(starValue)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                "w-6 h-6 transition-colors",
                starValue <= value
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200 hover:fill-amber-200 hover:text-amber-200"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
